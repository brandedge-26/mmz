import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock?: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  addItem:    (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggle:     (item: WishlistItem) => void;
  has:        (id: string) => boolean;
  clear:      () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (get().has(item.id)) return;
        set((s) => ({ items: [item, ...s.items] }));
      },

      removeItem: (id) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
      },

      toggle: (item) => {
        if (get().has(item.id)) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      has: (id) => get().items.some((i) => i.id === id),

      clear: () => set({ items: [] }),
    }),
    { name: "mmz-wishlist" }
  )
);
