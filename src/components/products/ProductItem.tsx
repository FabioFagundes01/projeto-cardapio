import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import Image from "next/image";

interface ProductItemProps {
  product: Product;
  onSelect: () => void; // <--- Adicionamos essa propriedade nova!
}

export const ProductItem = ({ product, onSelect }: ProductItemProps) => {
  return (
    <div 
      className="flex gap-4 w-full py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      onClick={onSelect} // <--- Agora o clique no card inteiro abre o modal
    >
      {/* Imagem */}
      <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
        <Image 
          src={`https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`} 
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Infos */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-medium text-gray-900">
            {formatCurrency(product.price)}
          </span>
          
          <button className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-red-600 transition-colors">
            <Plus size={14} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};