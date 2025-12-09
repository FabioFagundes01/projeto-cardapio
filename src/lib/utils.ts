// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função para combinar classes Tailwind condicionalmente (padrão shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para formatar dinheiro (Ex: 25.00 -> R$ 25,00)
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function checkIsStoreOpen() {
  const currentDate = new Date();
  const hour = currentDate.getHours();
  
  // Defina seu horário aqui (Ex: das 18h às 23h)
   return hour >= 18 && hour < 23; 
  
  // ⚠️ MODO DE TESTE (Retorna sempre TRUE para você conseguir testar agora de dia)
  // Quando for colocar pra valer, comente a linha abaixo e descomente a de cima.
  //return true; 
}