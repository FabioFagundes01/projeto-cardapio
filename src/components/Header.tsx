// src/components/Header.tsx
import { MapPin, Home } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white p-5 rounded-b-3xl shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary/10 p-3 rounded-full text-primary">
          <Home size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lanches do Fábio</h1>
          <p className="text-sm text-gray-500">O melhor smash da cidade</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 border border-gray-100">
        <MapPin size={16} className="text-primary" />
        <span>Rua das Flores, 123 - Centro, Ponta Grossa - PR</span>
      </div>
    </header>
  );
};