import { create } from "zustand";
import { persist } from "zustand/middleware";
import { privateAxios } from "@/lib/axios";

// Lazy import to break the authStore ↔ cartStore circular dependency
const getAuthStore = () =>
  import("@/store/authStore").then((m) => m.useAuthStore);

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  color?: string;
  quantity: number;
}

// Shape sent to / received from the backend
interface BackendCartItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem:           (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem:        (id: string, color?: string) => void;
  updateQuantity:    (id: string, color: string | undefined, qty: number) => void;
  clearCart:         () => void;
  totalItems:        () => number;
  totalPrice:        () => number;
  loadFromBackend:   (backendItems: BackendCartItem[]) => void;
  syncWithBackend:   () => Promise<void>;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function itemKey(id: string, color?: string) {
  return `${id}__${color ?? ""}`;
}

function toBackendItem(item: CartItem): BackendCartItem {
  return {
    productId:     item.id,
    slug:          item.slug,
    name:          item.name,
    brand:         item.brand,
    price:         item.price,
    originalPrice: item.originalPrice,
    image:         item.image,
    color:         item.color,
    quantity:      item.quantity,
  };
}

function fromBackendItem(b: BackendCartItem): CartItem {
  return {
    id:            b.productId,
    slug:          b.slug,
    name:          b.name,
    brand:         b.brand,
    price:         b.price,
    originalPrice: b.originalPrice,
    image:         b.image,
    color:         b.color,
    quantity:      b.quantity,
  };
}

/** Merge local + backend items: same id+color → max quantity; all unique items kept. */
function mergeItems(local: CartItem[], backend: BackendCartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();

  for (const item of local) {
    map.set(itemKey(item.id, item.color), { ...item });
  }

  for (const b of backend) {
    const converted = fromBackendItem(b);
    const key = itemKey(converted.id, converted.color);
    if (map.has(key)) {
      const existing = map.get(key)!;
      map.set(key, { ...existing, quantity: Math.max(existing.quantity, converted.quantity) });
    } else {
      map.set(key, converted);
    }
  }

  return Array.from(map.values());
}

// ── debounced sync ────────────────────────────────────────────────────────────

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSync() {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    syncTimer = null;
    try {
      const useAuthStore = await getAuthStore();
      if (!useAuthStore.getState().isAuthenticated) return;
      const items = useCartStore.getState().items.map(toBackendItem);
      await privateAxios.post("/cart/sync", { items });
    } catch {
      // best-effort — never break UI
    }
  }, 500);
}

// ── store ─────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        set((state) => {
          const key = itemKey(incoming.id, incoming.color);
          const existing = state.items.find((i) => itemKey(i.id, i.color) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.id, i.color) === key
                  ? { ...i, quantity: i.quantity + (incoming.quantity ?? 1) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...incoming, quantity: incoming.quantity ?? 1 }],
          };
        });
        scheduleSync();
      },

      removeItem: (id, color) => {
        const key = itemKey(id, color);
        set((state) => ({
          items: state.items.filter((i) => itemKey(i.id, i.color) !== key),
        }));
        scheduleSync();
      },

      updateQuantity: (id, color, qty) => {
        const key = itemKey(id, color);
        if (qty <= 0) {
          set((state) => ({
            items: state.items.filter((i) => itemKey(i.id, i.color) !== key),
          }));
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              itemKey(i.id, i.color) === key ? { ...i, quantity: qty } : i
            ),
          }));
        }
        scheduleSync();
      },

      clearCart: () => {
        set({ items: [] });
        scheduleSync();
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      /** Replace local items directly from a backend response array. */
      loadFromBackend: (backendItems) => {
        set({ items: backendItems.map(fromBackendItem) });
      },

      /** Full merge: GET backend → merge with local → POST merged → update local. */
      syncWithBackend: async () => {
        try {
          const useAuthStore = await getAuthStore();
          if (!useAuthStore.getState().isAuthenticated) return;
          const { data: getRes } = await privateAxios.get<{ items: BackendCartItem[] }>("/cart");
          const merged = mergeItems(get().items, getRes.items);
          const { data: syncRes } = await privateAxios.post<{ items: BackendCartItem[] }>("/cart/sync", {
            items: merged.map(toBackendItem),
          });
          set({ items: syncRes.items.map(fromBackendItem) });
        } catch {
          // best-effort
        }
      },
    }),
    { name: "mmz-cart" }
  )
);

// ── standalone login sync (called from authStore after login) ─────────────────

export async function syncCartOnLogin(): Promise<void> {
  try {
    const localItems = useCartStore.getState().items;
    const { data: getRes } = await privateAxios.get<{ items: BackendCartItem[] }>("/cart");
    const merged = mergeItems(localItems, getRes.items);
    const { data: syncRes } = await privateAxios.post<{ items: BackendCartItem[] }>("/cart/sync", {
      items: merged.map(toBackendItem),
    });
    useCartStore.getState().loadFromBackend(syncRes.items);
  } catch {
    // best-effort — never break the login flow
  }
}
