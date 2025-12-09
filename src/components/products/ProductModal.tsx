// src/components/products/ProductModal.tsx
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { meatOptions } from "@/data/menu";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const { upsertItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedMeat, setSelectedMeat] = useState<string | undefined>(
    product?.Category === 'shawarmas' || product?.Category === 'beirutes' ? 'bovino' : undefined
  );

  if (!product) return null;

  // Lógica de Preço (Se escolher Frango, pode ser mais barato, etc)
  const getPrice = () => {
    let finalPrice = product.price;
    if (selectedMeat) {
      const meatOption = meatOptions.find(m => m.value === selectedMeat);
      if (meatOption) finalPrice += meatOption.price;
    }
    return finalPrice * quantity;
  };

  const handleAddToCart = () => {
    upsertItem({
      ...product,
      quantity,
      meat: selectedMeat,
      Category: product.Category // Garante que o tipo Category bata
    });
    onClose(); // Fecha o modal
    setQuantity(1); // Reseta
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* O Card do Modal */}
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Foto Grande no Topo */}
        <div className="relative h-48 w-full bg-gray-200">
          <Image 
            src={`https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`} 
            alt={product.name} fill className="object-cover" 
          />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-gray-500 text-sm mt-2">{product.description}</p>

          {/* Seletor de Carne (Só aparece se for Shawarma/Beirute) */}
          {(product.Category === 'shawarmas' || product.Category === 'beirutes') && (
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-3 text-gray-700">Escolha a carne:</h3>
              <div className="flex gap-3">
                {meatOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedMeat(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                      selectedMeat === option.value 
                        ? 'border-primary bg-primary/10 text-primary font-bold' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controle de Quantidade e Botão Final */}
          <div className="mt-8 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-primary disabled:text-gray-300">
                <Minus size={20} />
              </button>
              <span className="font-bold w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-primary">
                <Plus size={20} />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white font-bold h-12 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-between px-6"
            >
              <span>Adicionar</span>
              <span>{formatCurrency(getPrice())}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};