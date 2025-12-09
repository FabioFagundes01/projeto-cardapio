import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartItem } from "@/types";
import { meatOptions } from "@/data/menu";

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: string) => void; // Agora usa string (cartId)
  upsertItem: (item: Omit<CartItem, "cartId">) => void; // Recebe sem ID e gera dentro
  decreaseQuantity: (cartId: string) => void; // <--- NOVA FUNÇÃO
  increaseQuantity: (cartId: string) => void; // <--- NOVA FUNÇÃO
  cartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Adiciona direto (gera um ID aleatório)
      addToCart: (item) => set((state) => ({ 
        items: [...state.items, { ...item, cartId: crypto.randomUUID() }] 
      })),

      removeFromCart: (cartId) => set((state) => ({
        items: state.items.filter((item) => item.cartId !== cartId) 
      })),

      // Adiciona ou Incrementa (Lógica Inteligente)
      upsertItem: (newItem) => set((state) => {
        // Procura se já existe um item IDÊNTICO (mesma carne, obs e extras)
        const existingItemIndex = state.items.findIndex(
          (i) => i.id === newItem.id && 
                 i.meat === newItem.meat && 
                 i.observation === newItem.observation &&
                 JSON.stringify(i.extras) === JSON.stringify(newItem.extras)
        );

        // Se já existe, só aumenta a quantidade
        if (existingItemIndex > -1) {
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += newItem.quantity;
          return { items: newItems };
        }

        // Se não existe, cria um novo com um ID ÚNICO
        return { 
          items: [...state.items, { ...newItem, cartId: crypto.randomUUID() }] 
        };
      }),

      // Diminuir Quantidade (Botão -)
      decreaseQuantity: (cartId) => set((state) => {
        const index = state.items.findIndex(i => i.cartId === cartId);
        if (index > -1) {
          const newItems = [...state.items];
          if (newItems[index].quantity > 1) {
            newItems[index].quantity -= 1; // Diminui 1
            return { items: newItems };
          } else {
            // Se chegar a 0, remove o item
            return { items: state.items.filter(i => i.cartId !== cartId) };
          }
        }
        return state;
      }),

      // Aumentar Quantidade (Botão +)
      increaseQuantity: (cartId) => set((state) => {
        const index = state.items.findIndex(i => i.cartId === cartId);
        if (index > -1) {
          const newItems = [...state.items];
          newItems[index].quantity += 1; // Aumenta 1
          return { items: newItems };
        }
        return state;
      }),

      cartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let itemPrice = item.price;
          if (item.meat) {
            const meatOption = meatOptions.find(m => m.value === item.meat);
            if (meatOption) itemPrice += meatOption.price;
          }
          if (item.extras) {
            itemPrice += item.extras.reduce((acc, extra) => acc + extra.price, 0);
          }
          return total + (itemPrice * item.quantity);
        }, 0);
      }
    }),
    {
      name: "cardapio-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);