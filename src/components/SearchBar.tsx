"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  text: string;
  onChange: (text: string) => void;
}

export const SearchBar = ({ text, onChange }: SearchBarProps) => {
  return (
    <div className="px-4 pt-2 pb-4 bg-white">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
        <input 
          type="text"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="O que você procura? (Ex: Bacon, Coca...)" 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};