import type { Product } from "./product.types";

//el carrito va a ser un array de productos, con la info de cada producto mas la cantidad 
export type CartItem = {
  product: Product;
  quantity: number;
};
