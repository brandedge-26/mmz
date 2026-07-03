import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface CartState {
  items: CartItem[];
  addItem:        (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem:     (id: string, color?: string) => void;
  updateQuantity: (id: string, color: string | undefined, qty: number) => void;
  clearCart:      () => void;
  totalItems:     () => number;
  totalPrice:     () => number;
}

function itemKey(id: string, color?: string) {
  return `${id}__${color ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        set((state) => {
          const key = itemKey(incoming.id, incoming.color);
          const existing = state.items.find(
            (i) => itemKey(i.id, i.color) === key
          );
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
            items: [
              ...state.items,
              { ...incoming, quantity: incoming.quantity ?? 1 },
            ],
          };
        });
      },

      removeItem: (id, color) => {
        const key = itemKey(id, color);
        set((state) => ({
          items: state.items.filter((i) => itemKey(i.id, i.color) !== key),
        }));
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
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "mmz-cart" }
  )
);
