"use client";

import { Category } from "@/types";

interface CategoryTabsProps {
  categories: { key: string; title: string }[];
  selectedCategory: string;
  onSelectCategory: (key: string) => void;
}

export const CategoryTabs = ({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) => {
  
  const handleScrollToCategory = (key: string) => {
    onSelectCategory(key);
    const element = document.getElementById(key);
    if (element) {
      // Ajuste de -100px para compensar a altura do header fixo
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="flex gap-4 overflow-x-auto px-4 py-3 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleScrollToCategory(cat.key)}
            className={`
              whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-colors
              ${selectedCategory === cat.key 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            {cat.title}
          </button>
        ))}
      </div>
    </div>
  );
};