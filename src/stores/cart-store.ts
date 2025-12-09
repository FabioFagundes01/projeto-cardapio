import { create } from "zustand";
import { CartItem } from "@/types";
import { meatOptions } from "@/data/menu";

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: number) => void;
  upsertItem: (item: CartItem) => void;
  cartTotal: () => number; // <--- Agora declaramos ela aqui!
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),

  removeFromCart: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id) 
  })),

  upsertItem: (newItem) => set((state) => {
    const existingItemIndex = state.items.findIndex(
      (i) => i.id === newItem.id && i.meat === newItem.meat
    );

    if (existingItemIndex > -1) {
      const newItems = [...state.items];
      newItems[existingItemIndex].quantity += newItem.quantity;
      return { items: newItems };
    }

    return { items: [...state.items, newItem] };
  }),

  // <--- A função que faltava:
  cartTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      // Pega o preço base
      let itemPrice = item.price;
      
      // Se tiver carne escolhida, ajusta o preço (ex: Frango é mais barato)
      if (item.meat) {
        const meatOption = meatOptions.find(m => m.value === item.meat);
        if (meatOption) itemPrice += meatOption.price;
      }

      return total + (itemPrice * item.quantity);
    }, 0);
  }
}));