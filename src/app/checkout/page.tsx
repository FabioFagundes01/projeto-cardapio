"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { meatOptions } from "@/data/menu";

export default function CheckoutPage() {
  const { items, removeFromCart, cartTotal } = useCartStore();
  
  // Estados do Formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isDelivery, setIsDelivery] = useState(true);
  const [address, setAddress] = useState("");

  // SEU NÚMERO DE WHATSAPP AQUI (Com 55 e DDD)
  const PHONE_NUMBER = "5542999999999"; 

  // Se o carrinho estiver vazio
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
        <Link href="/" className="text-primary font-bold hover:underline">
          Voltar para o cardápio
        </Link>
      </div>
    );
  }

  // Lógica para enviar o pedido
  const handleFinishOrder = () => {
    if (!name || (!address && isDelivery)) {
      alert("Por favor, preencha seus dados!");
      return;
    }

    // 1. Monta o texto do pedido
    let message = `*NOVO PEDIDO* 🍔\n`;
    message += `------------------------------\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Telefone:* ${phone}\n`;
    message += `------------------------------\n\n`;

    items.forEach((item) => {
      message += `*${item.quantity}x ${item.name}*\n`;
      
      // Detalhes (Carne, etc)
      if (item.meat) {
        const meatLabel = meatOptions.find(m => m.value === item.meat)?.label;
        message += `   Carne: ${meatLabel}\n`;
      }
      
      message += `   Preço: ${formatCurrency(item.price * item.quantity)}\n\n`;
    });

    message += `------------------------------\n`;
    message += `*Total: ${formatCurrency(cartTotal())}*\n`;
    message += `------------------------------\n`;
    
    if (isDelivery) {
      message += `🛵 *Entrega para:*\n${address}`;
    } else {
      message += `📍 *Vou retirar no balcão*`;
    }

    // 2. Codifica para URL e abre o WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      
      {/* Topo com botão voltar */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-lg">Finalizar Pedido</h1>
      </header>

      <div className="max-w-xl mx-auto p-4 space-y-6">
        
        {/* 1. Lista de Itens */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Seus Itens</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-0.5 rounded">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  {item.meat && (
                    <p className="text-xs text-gray-500 mt-1 ml-8">
                      Carne: {meatOptions.find(m => m.value === item.meat)?.label}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-600">Total do Pedido</span>
            <span className="font-bold text-xl text-gray-900">
              {formatCurrency(cartTotal())}
            </span>
          </div>
        </section>

        {/* 2. Dados do Cliente */}
        <section className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <h2 className="font-bold text-gray-800">Seus Dados</h2>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..." 
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Telefone / WhatsApp</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000" 
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary"
            />
          </div>
        </section>

        {/* 3. Tipo de Entrega */}
        <section className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <h2 className="font-bold text-gray-800">Entrega ou Retirada?</h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDelivery(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${isDelivery ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              Entrega 🛵
            </button>
            <button 
              onClick={() => setIsDelivery(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${!isDelivery ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}
            >
              Retirada 🏪
            </button>
          </div>

          {/* Campo de Endereço (Só aparece se for entrega) */}
          {isDelivery && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm text-gray-600 mb-1">Endereço Completo</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, Número, Bairro e Complemento..." 
                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary h-24 resize-none"
              />
            </div>
          )}
        </section>

        {/* Botão Final */}
        <button 
          onClick={handleFinishOrder}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>Enviar Pedido no WhatsApp</span>
        </button>

      </div>
    </div>
  );
}