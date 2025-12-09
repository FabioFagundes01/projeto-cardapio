"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"; // <--- Importamos useEffect e useState

export const CartFooter = () => {
  const { items, cartTotal } = useCartStore();
  const [isMounted, setIsMounted] = useState(false); // Controle de montagem

  // Isso garante que o componente só renderize no cliente (navegador)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Se ainda não montou ou carrinho vazio, não mostra nada
  if (!isMounted) return null;

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  if (totalQuantity === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-primary p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-white">
        
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
            <span className="text-xs text-white/90 font-medium">Total sem entrega</span>
            <span className="font-bold text-lg leading-none">
              {formatCurrency(cartTotal())}
            </span>
          </div>
        </div>

        <Link 
          href="/checkout" 
          className="bg-white text-primary font-bold py-2 px-6 rounded-full text-sm hover:bg-gray-100 transition-colors shadow-sm"
        >
          Ver Carrinho
        </Link>
        
      </div>
    </div>
  );
};