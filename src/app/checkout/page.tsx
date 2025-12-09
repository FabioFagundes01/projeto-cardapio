"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { meatOptions, deliveryRegions, DeliveryRegion } from "@/data/menu";

export default function CheckoutPage() {
  const { items, removeFromCart, cartTotal } = useCartStore();
  
  // Estados do Formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isDelivery, setIsDelivery] = useState(true);
  
  // Agora temos um objeto para o bairro selecionado
  const [selectedRegion, setSelectedRegion] = useState<DeliveryRegion | null>(null);
  const [addressNumber, setAddressNumber] = useState(""); // Rua e Número

  const PHONE_NUMBER = "5542998471585"; 

  // Calcula o valor final (Produtos + Entrega)
  const calculateTotal = () => {
    const subtotal = cartTotal();
    const deliveryFee = isDelivery && selectedRegion ? selectedRegion.price : 0;
    return subtotal + deliveryFee;
  };

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

  const handleFinishOrder = () => {
    // Validação
    if (!name || !phone) {
      alert("Por favor, preencha nome e telefone!");
      return;
    }
    
    if (isDelivery && (!selectedRegion || !addressNumber)) {
      alert("Para entrega, selecione o bairro e informe o endereço!");
      return;
    }

    // 1. Monta o texto do pedido
    let message = `*NOVO PEDIDO* 🍔\n`;
    message += `------------------------------\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Telefone:* ${phone}\n`;
    message += `------------------------------\n\n`;

    // Lista os itens
    items.forEach((item) => {
      message += `*${item.quantity}x ${item.name}*\n`;
      if (item.meat) {
        const meatLabel = meatOptions.find(m => m.value === item.meat)?.label;
        message += `   Carne: ${meatLabel}\n`;
      }
      if (item.observation) {
        message += `   Obs: ${item.observation}\n`;
      }
      message += `   Valor: ${formatCurrency(item.price * item.quantity)}\n\n`;
    });

    message += `------------------------------\n`;
    message += `Subtotal: ${formatCurrency(cartTotal())}\n`;
    
    if (isDelivery && selectedRegion) {
      message += `🛵 Entrega (${selectedRegion.name}): ${formatCurrency(selectedRegion.price)}\n`;
      message += `📍 *Endereço:* ${addressNumber} - ${selectedRegion.name}\n`;
    } else {
      message += `📍 *Retirada no Balcão* (Sem taxa)\n`;
    }

    message += `------------------------------\n`;
    message += `*TOTAL A PAGAR: ${formatCurrency(calculateTotal())}*\n`;
    message += `------------------------------\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-lg">Finalizar Pedido</h1>
      </header>

      <div className="max-w-xl mx-auto p-4 space-y-6">
        
        {/* Lista de Itens (Resumo) */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Resumo do Pedido</h2>
          </div>
          {/* ... (Lista de itens igual ao anterior, omiti para poupar espaço) ... */}
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
        </section>

        {/* Dados do Cliente */}
        <section className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <h2 className="font-bold text-gray-800">Seus Dados</h2>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome Completo</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Telefone / WhatsApp</label>
            <input 
              type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary"
            />
          </div>
        </section>

        {/* Entrega ou Retirada */}
        <section className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <h2 className="font-bold text-gray-800">Forma de Entrega</h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDelivery(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold border transition-colors ${isDelivery ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              Entrega 🛵
            </button>
            <button 
              onClick={() => setIsDelivery(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold border transition-colors ${!isDelivery ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              Retirada 🏪
            </button>
          </div>

          {/* Seletor de Bairro e Endereço */}
          {isDelivery && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Selecione seu Bairro</label>
                <select
                  value={selectedRegion?.id || ""}
                  onChange={(e) => {
                    const region = deliveryRegions.find(r => r.id === Number(e.target.value));
                    setSelectedRegion(region || null);
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary bg-white"
                >
                  <option value="">Selecione...</option>
                  {deliveryRegions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name} - {formatCurrency(region.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Rua e Número</label>
                <input 
                  type="text"
                  value={addressNumber}
                  onChange={(e) => setAddressNumber(e.target.value)}
                  placeholder="Ex: Rua das Flores, 123"
                  className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary"
                />
              </div>

            </div>
          )}
        </section>

        {/* Resumo de Valores */}
        <section className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal())}</span>
          </div>
          
          {isDelivery && (
            <div className="flex justify-between text-gray-600">
              <span>Taxa de Entrega</span>
              <span>
                {selectedRegion ? formatCurrency(selectedRegion.price) : "Selecione o bairro"}
              </span>
            </div>
          )}

          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
            <span>Total</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </section>

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