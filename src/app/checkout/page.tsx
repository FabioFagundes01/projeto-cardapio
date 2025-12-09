"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { checkIsStoreOpen } from "@/lib/utils";
import { ArrowLeft, Trash2, ShoppingBag, Minus, Plus } from "lucide-react"; // Importei Minus e Plus
import Link from "next/link";
import { useState } from "react";
import { meatOptions, deliveryRegions, DeliveryRegion } from "@/data/menu";

export default function CheckoutPage() {
  // Pegando as novas funções da loja
  const { items, removeFromCart, cartTotal, increaseQuantity, decreaseQuantity } = useCartStore();
  const isOpen = checkIsStoreOpen();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isDelivery, setIsDelivery] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<DeliveryRegion | null>(null);
  const [addressNumber, setAddressNumber] = useState("");

  const PHONE_NUMBER = "5542998471585"; 

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
    if (!name || !phone) {
      alert("Por favor, preencha nome e telefone!");
      return;
    }
    
    if (isDelivery && (!selectedRegion || !addressNumber)) {
      alert("Para entrega, selecione o bairro e informe o endereço!");
      return;
    }

    let message = `*NOVO PEDIDO* 🍔\n`;
    message += `------------------------------\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Telefone:* ${phone}\n`;
    message += `------------------------------\n\n`;

    items.forEach((item) => {
      message += `*${item.quantity}x ${item.name}*\n`;
      if (item.meat) {
        const meatLabel = meatOptions.find(m => m.value === item.meat)?.label;
        message += `   Carne: ${meatLabel}\n`;
      }
      if (item.extras && item.extras.length > 0) {
        message += `   Extras: ${item.extras.map(e => e.name).join(', ')}\n`;
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
        
        {/* LISTA DE ITENS MELHORADA */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Resumo do Pedido</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.cartId} className="p-4 flex flex-col gap-3">
                
                {/* Linha 1: Nome e Preço */}
                <div className="flex justify-between items-start">
                   <div className="flex-1">
                      <span className="font-bold text-gray-900">{item.name}</span>
                      
                      {/* Detalhes (Carne, Extras, Obs) */}
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        {item.meat && <p>Carne: {meatOptions.find(m => m.value === item.meat)?.label}</p>}
                        {item.extras && item.extras.length > 0 && <p>+ {item.extras.map(e => e.name).join(', ')}</p>}
                        {item.observation && <p className="text-orange-600 italic">Obs: {item.observation}</p>}
                      </div>
                   </div>
                   <span className="font-bold text-gray-900 ml-4">
                     {formatCurrency(item.price * item.quantity)}
                   </span>
                </div>

                {/* Linha 2: Controles de Quantidade */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                    <button 
                      onClick={() => decreaseQuantity(item.cartId)} 
                      className="p-1 text-primary hover:bg-white rounded transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => increaseQuantity(item.cartId)} 
                      className="p-1 text-primary hover:bg-white rounded transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Botão de Remover Tudo (Lixeira) */}
                  <button 
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* ... (O RESTO DO FORMULÁRIO CONTINUA IGUAL) ... */}
        {/* Copie o resto (Dados, Entrega, Botão Final) do arquivo anterior aqui */}
        <section className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <h2 className="font-bold text-gray-800">Seus Dados</h2>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome Completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Telefone / WhatsApp</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary" />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <h2 className="font-bold text-gray-800">Forma de Entrega</h2>
          <div className="flex gap-2">
            <button onClick={() => setIsDelivery(true)} className={`flex-1 py-3 rounded-lg text-sm font-bold border ${isDelivery ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>Entrega 🛵</button>
            <button onClick={() => setIsDelivery(false)} className={`flex-1 py-3 rounded-lg text-sm font-bold border ${!isDelivery ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>Retirada 🏪</button>
          </div>
          {isDelivery && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Selecione seu Bairro</label>
                <select value={selectedRegion?.id || ""} onChange={(e) => { const region = deliveryRegions.find(r => r.id === Number(e.target.value)); setSelectedRegion(region || null); }} className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary bg-white">
                  <option value="">Selecione...</option>
                  {deliveryRegions.map(region => (<option key={region.id} value={region.id}>{region.name} - {formatCurrency(region.price)}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Rua e Número</label>
                <input type="text" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} placeholder="Ex: Rua das Flores, 123" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-primary" />
              </div>
            </div>
          )}
        </section>

        <section className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(cartTotal())}</span></div>
          {isDelivery && (<div className="flex justify-between text-gray-600"><span>Taxa de Entrega</span><span>{selectedRegion ? formatCurrency(selectedRegion.price) : "Selecione o bairro"}</span></div>)}
          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2"><span>Total</span><span>{formatCurrency(calculateTotal())}</span></div>
        </section>

        <button 
          onClick={handleFinishOrder}
          disabled={!isOpen} // Desabilita se estiver fechado
          className={`w-full font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2
            ${isOpen 
              ? 'bg-green-600 text-white hover:bg-green-700' // Estilo Aberto
              : 'bg-gray-400 text-gray-200 cursor-not-allowed' // Estilo Fechado
            }
          `}
        >
          {isOpen ? 'Enviar Pedido no WhatsApp' : 'Loja Fechada no Momento'}
        </button>

      </div>
    </div>
  );
}