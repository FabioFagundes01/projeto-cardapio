"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link"; // Para navegar para o checkout depois

export const CartFooter = () => {
  const { items, cartTotal } = useCartStore();

  // Calcula a quantidade total de itens (ex: 2 hambúrgueres + 1 refri = 3)
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  // Se o carrinho estiver vazio, não mostra nada (ou mostra barra discreta)
  if (totalQuantity === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-primary p-4 shadow-top z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-white">
        
        {/* Lado Esquerdo: Contador e Valor */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-white/20 p-2 rounded-full">
              <ShoppingCart size={24} />
            </div>
            <span className="absolute -top-1 -right-1 bg-white text-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalQuantity}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-white/80">Total sem entrega</span>
            <span className="font-bold text-lg leading-none">
              {formatCurrency(cartTotal())}
            </span>
          </div>
        </div>

        {/* Lado Direito: Botão de Ver Sacola */}
        <Link 
          href="/checkout" 
          className="bg-white text-primary font-bold py-2 px-6 rounded-full text-sm hover:bg-gray-100 transition-colors"
        >
          Ver Carrinho
        </Link>
        
      </div>
    </div>
  );
};