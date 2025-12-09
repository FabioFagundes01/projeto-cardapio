import { Product } from "@/types";

export const products: Product[] = [
  // --- HAMBÚRGUERES ---
  {
    id: 1,
    name: "Smash Simples",
    description: "Pão Brioche, Hambúrguer Smash, Queijo Cheddar, Maionese artesanal. Acompanha fritas.",
    price: 25.00, // PREÇO ESTIMADO - CONFIRME COM O CLIENTE
    image: "/images/burger1.jpg", // Depois colocamos as fotos
    Category: "burgers"
  },
  {
    id: 2,
    name: "Smash Bacon",
    description: "Pão Brioche, Hambúrguer Smash, Queijo Cheddar, Fatias de Bacon, Molho Street. Acompanha fritas.",
    price: 28.00, 
    image: "/images/burger2.jpg",
    Category: "burgers"
  },
  {
    id: 3,
    name: "Smash Salad",
    description: "Pão Brioche, Hambúrguer Smash, Queijo, tomate em cubos, alface, maionese artesanal. Acompanha fritas.",
    price: 26.00,
    image: "/images/burger3.jpg",
    Category: "burgers"
  },
  {
    id: 4,
    name: "Smash Duplo",
    description: "Pão Brioche, 2x Hambúrgueres smash, queijo cheddar, cebola crispy, molho barbecue, molho street. Acompanha fritas.",
    price: 35.00,
    image: "/images/burger4.jpg",
    Category: "burgers"
  },
  {
    id: 5,
    name: "Smash Australiano",
    description: "Pão australiano, hambúrguer smash, queijo cheddar, fatias de bacon, cebola caramelizada, maionese artesanal. Acompanha fritas.",
    price: 32.00,
    image: "/images/burger5.jpg",
    Category: "burgers"
  },

  // --- SHAWARMAS (Preço base, o seletor de carne ajusta se precisar) ---
  {
    id: 10,
    name: "Shawarma Tradicional",
    description: "Pão folha, alface, tomate, cebola roxa, picles, molho sírio, batata frita e maionese de alho.",
    price: 28.00,
    image: "/images/shawarma.jpg",
    Category: "shawarmas"
  },

  // --- BEIRUTES ---
  {
    id: 20,
    name: "Beirute",
    description: "Pão sírio, alface, tomate, cebola roxa, picles, molho sírio especial, maionese artesanal.",
    price: 30.00,
    image: "/images/beirute.jpg",
    Category: "beirutes"
  },

  // --- BEBIDAS ---
  {
    id: 30,
    name: "Coca-Cola Lata",
    description: "350ml",
    price: 6.00,
    image: "/images/coca.jpg",
    Category: "drinks"
  },
  {
    id: 31,
    name: "Suco Del Valle",
    description: "Lata 290ml (Uva ou Laranja)",
    price: 6.00,
    image: "/images/suco.jpg",
    Category: "drinks"
  }
];

// Opções extras para Shawarma/Beirute
export const meatOptions = [
  { label: "Bovino", value: "bovino", price: 0 },
  { label: "Frango", value: "frango", price: -2 }, // Exemplo: Frango é mais barato
  { label: "Misto", value: "misto", price: 0 },
];

export interface DeliveryRegion {
  id: number;
  name: string;
  price: number;
}

export const deliveryRegions: DeliveryRegion[] = [
  { id: 1, name: "Centro", price: 5.00 },
  { id: 2, name: "Uvaranas", price: 8.00 },
  { id: 3, name: "Oficinas", price: 7.00 },
  { id: 4, name: "Nova Rússia", price: 9.00 },
  { id: 5, name: "Jardim Carvalho", price: 6.00 },
  // Adicione mais bairros conforme a necessidade do cliente
];