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
  cartId: string; // <--- O "RG" único do item dentro do carrinho
  quantity: number;
  meat?: string;
  removedIngredients?: string[];
  observation?: string;
  extras?: { id: number; name: string; price: number }[];
}

