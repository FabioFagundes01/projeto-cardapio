import { MapPin } from "lucide-react";
import Image from "next/image";

export const Header = () => {
  // LÓGICA DE HORÁRIO
  const currentDate = new Date();
  const hour = currentDate.getHours();
  // Defina aqui o horário (Ex: das 18h às 23h)
  const isOpen = hour >= 0 && hour < 23; 

  return (
    <header className="bg-white p-5 rounded-b-3xl shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-4 mb-3">
        {/* Logo */}
        <Image 
          src="/images/logo.png" 
          alt="Logo Coombo Street" 
          width={80} 
          height={80}
          className="object-contain"
          priority
        />
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Coombo Street</h1>
          
          {/* Badge de Aberto/Fechado */}
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm font-medium text-gray-600">
              {isOpen ? "Aberto agora" : "Fechado no momento"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 border border-gray-100">
        <MapPin size={16} className="text-primary" />
        <span>Rua das Flores, 123 - Centro, Ponta Grossa</span>
      </div>
    </header>
  );
};