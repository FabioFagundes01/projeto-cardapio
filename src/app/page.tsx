"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { CartFooter } from "@/components/CartFooter";
import { ProductItem } from "@/components/products/ProductItem";
import { ProductModal } from "@/components/products/ProductModal";
import { products } from "@/data/menu";
import { Category, Product } from "@/types";

// Função auxiliar para pegar produtos por categoria
const getProductsByCategory = (category: Category) => {
  return products.filter((product) => product.Category === category);
};

export default function Home() {
  // Estado para controlar qual produto foi clicado (para abrir o modal)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Ordem das categorias na tela
  const categoriesOrder = [
    { key: 'burgers', title: '🍔 Hambúrgueres' },
    { key: 'shawarmas', title: '🌯 Shawarmas' },
    { key: 'beirutes', title: '🥙 Beirutes' },
    { key: 'drinks', title: '🥤 Bebidas' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      
      {/* 1. Topo */}
      <Header />

      {/* 2. Listagem por Categoria */}
      <div className="px-4 pt-6 space-y-8 max-w-4xl mx-auto">
        
        {categoriesOrder.map((cat) => {
          const items = getProductsByCategory(cat.key as Category);
          
          if (items.length === 0) return null;

          return (
            <section key={cat.key}>
              <h2 className="font-bold text-lg text-gray-800 mb-3 pl-1 border-l-4 border-primary">
                &nbsp;{cat.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((product) => (
                  <ProductItem 
                    key={product.id} 
                    product={product}
                    // AQUI: Quando clicar, salva o produto no estado para abrir o modal
                    onSelect={() => setSelectedProduct(product)} 
                  />
                ))}
              </div>
            </section>
          );
        })}

      </div>

      {/* 3. Rodapé Fixo */}
      <CartFooter />

      {/* 4. Modal de Produto (Só aparece se tiver um produto selecionado) */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      
    </main>
  );
}