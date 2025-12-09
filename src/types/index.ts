export type Category = 'burgers' | 'shawarmas' | 'beirutes' | 'combos' | 'drinks';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  Category: Category;
}


export interface CartItem extends Product {
  quantity: number;
  meat?: string; // Para Shawarma/Beirute (Bovino, Frango, Misto)
  removedIngredients?: string[]; // Para tirar salada/cebola
  observation?: string;
}