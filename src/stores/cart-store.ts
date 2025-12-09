import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartItem } from "@/types";
import { meatOptions } from "@/data/menu";

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: number) => void;
  upsertItem: (item: CartItem) => void;
  cartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),

      removeFromCart: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id) 
      })),

      upsertItem: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (i) => i.id === newItem.id && i.meat === newItem.meat && i.observation === newItem.observation
        );

        if (existingItemIndex > -1) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += newItem.quantity;
          return { items: newItems };
        }

        return { items: [...state.items, newItem] };
      }),

      cartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let itemPrice = item.price;
          if (item.meat) {
            const meatOption = meatOptions.find(m => m.value === item.meat);
            if (meatOption) itemPrice += meatOption.price;
          }
          return total + (itemPrice * item.quantity);
        }, 0);
      }
    }),
    {
      name: "cardapio-storage",
      storage: createJSONStorage(() => localStorage),
      // REMOVEMOS O skipHydration DAQUI
    }
  )
);