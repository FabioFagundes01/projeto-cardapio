"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { CartFooter } from "@/components/CartFooter";
import { ProductItem } from "@/components/products/ProductItem";
import { ProductModal } from "@/components/products/ProductModal";
import { CategoryTabs } from "@/components/CategoryTabs";
import { SearchBar } from "@/components/SearchBar"; // <--- NOVO IMPORT
import { products } from "@/data/menu";
import { Category, Product } from "@/types";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("burgers");
  const [searchText, setSearchText] = useState(""); // <--- ESTADO DA BUSCA

  const categoriesOrder = [
    { key: 'burgers', title: '🍔 Hambúrgueres' },
    { key: 'shawarmas', title: '🌯 Shawarmas' },
    { key: 'beirutes', title: '🥙 Beirutes' },
    { key: 'drinks', title: '🥤 Bebidas' },
  ];

  // 🔎 LÓGICA DE FILTRO
  // Se tiver texto na busca, filtra. Se não, usa a lista completa.
  const filteredList = products.filter(product => {
    const search = searchText.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) || 
      product.description.toLowerCase().includes(search)
    );
  });

  // Função auxiliar agora usa a lista filtrada, não a original
  const getProductsByCategory = (category: Category) => {
    return filteredList.filter((product) => product.Category === category);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      
      <Header />

      {/* BARRA DE PESQUISA (Fica fixa junto com o header visualmente) */}
      <div className="sticky top-0 z-40 bg-white">
        <SearchBar text={searchText} onChange={setSearchText} />
        
        {/* As abas só aparecem se NÃO estiver buscando (para não poluir) */}
        {!searchText && (
          <CategoryTabs 
            categories={categoriesOrder} 
            selectedCategory={activeCategory} 
            onSelectCategory={setActiveCategory} 
          />
        )}
      </div>

      <div className="px-4 pt-6 space-y-8 max-w-4xl mx-auto">
        
        {categoriesOrder.map((cat) => {
          const items = getProductsByCategory(cat.key as Category);
          
          // Se o filtro removeu tudo dessa categoria, esconde ela
          if (items.length === 0) return null;

          return (
            <section 
              key={cat.key} 
              id={cat.key} 
              className="scroll-mt-48" // Aumentei a margem pq agora tem a barra de busca
            >
              <h2 className="font-bold text-lg text-gray-800 mb-3 pl-1 border-l-4 border-primary">
                &nbsp;{cat.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((product) => (
                  <ProductItem 
                    key={product.id} 
                    product={product}
                    onSelect={() => setSelectedProduct(product)} 
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* MENSAGEM DE "NADA ENCONTRADO" */}
        {filteredList.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg font-medium">Nenhum produto encontrado 😢</p>
            <p className="text-sm">Tente buscar por outro termo.</p>
          </div>
        )}

      </div>

      <CartFooter />
      
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      
    </main>
  );
}