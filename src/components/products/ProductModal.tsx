import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { meatOptions, extraOptions, Extra } from "@/data/menu";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // <--- Importando animação

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const { upsertItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");
  const [selectedMeat, setSelectedMeat] = useState<string | undefined>(
    product?.Category === 'shawarmas' || product?.Category === 'beirutes' ? 'bovino' : undefined
  );
  // Estado para os Extras selecionados
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

  if (!product) return null;

  // Função para marcar/desmarcar extras
  const handleToggleExtra = (extra: Extra) => {
    const alreadySelected = selectedExtras.some(e => e.id === extra.id);
    if (alreadySelected) {
      setSelectedExtras(prev => prev.filter(e => e.id !== extra.id));
    } else {
      setSelectedExtras(prev => [...prev, extra]);
    }
  };

  const getPrice = () => {
    let finalPrice = product.price;
    
    if (selectedMeat) {
      const meatOption = meatOptions.find(m => m.value === selectedMeat);
      if (meatOption) finalPrice += meatOption.price;
    }

    // Soma o preço dos extras
    const extrasPrice = selectedExtras.reduce((acc, extra) => acc + extra.price, 0);
    finalPrice += extrasPrice;

    return finalPrice * quantity;
  };

  const handleAddToCart = () => {
    upsertItem({
      ...product,
      quantity,
      meat: selectedMeat,
      observation,
      extras: selectedExtras, // <--- Enviando os extras
      Category: product.Category
    });
    
    toast.success(`Adicionado ao carrinho!`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
      iconTheme: { primary: '#EA580C', secondary: '#FFFAEE' },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* ANIMAÇÃO AQUI: motion.div */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        
        <div className="relative h-48 w-full bg-gray-200">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-gray-500 text-sm mt-2">{product.description}</p>

          {/* Seletor de Carne */}
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

          {/* --- NOVO: SELEÇÃO DE ADICIONAIS --- */}
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Adicionais?</h3>
            <div className="space-y-2">
              {extraOptions.map(extra => {
                const isSelected = selectedExtras.some(e => e.id === extra.id);
                return (
                  <div 
                    key={extra.id} 
                    onClick={() => handleToggleExtra(extra)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected ? 'border-primary bg-orange-50' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-primary border-primary' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm text-gray-700">{extra.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      +{formatCurrency(extra.price)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Observação */}
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-2 text-gray-700">Observações:</h3>
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-primary resize-none bg-gray-50"
              rows={3}
              placeholder="Ex: Tirar a cebola..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-primary disabled:text-gray-300"><Minus size={20} /></button>
              <span className="font-bold w-4 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="text-primary"><Plus size={20} /></button>
            </div>

            <button onClick={handleAddToCart} className="flex-1 bg-primary text-white font-bold h-12 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-between px-6">
              <span>Adicionar</span>
              <span>{formatCurrency(getPrice())}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};