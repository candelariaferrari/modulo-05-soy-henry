import { createContext, useContext, useState } from "react";
import type { Product } from "../types/product.types";

interface ProductsConTextType {
  products: Product[];
}

const ProductsContext = createContext<ProductsConTextType | undefined>(
  undefined,
);

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const DEFAUL_PRODUCT_IMAGE = "https://www.freeiconspng.com/img/2114";

  const [products] = useState<Product[]>([
    {id:"1",
      name:"adidas",
      imageUrl: DEFAUL_PRODUCT_IMAGE,
      description:"zapas", 
      price:180,
      stock:8,
    }
  ]);
  return(
    <ProductsContext.Provider value={{products,}}>
      {children}
    </ProductsContext.Provider>
  )
}


//custom hook
export const useProducts = () => {
  // useContext busca el valor más cercano de <ProductsContext.Provider> en el árbol de componentes.
  // Si este hook se usa DENTRO de un <ProductsProvider>, context va a tener el objeto real ({products, loading, ...}).
  // Si se usa FUERA (sin Provider arriba), context va a ser "undefined" (el valor inicial del createContext).
  const context = useContext(ProductsContext);

  // Guard: valida que el context no sea undefined ANTES de devolverlo.
  if (!context) {
    // throw corta la ejecución en este punto y lanza un error hacia arriba.
    // A diferencia de un "return null" o un console.error, throw DETIENE el componente
    // que llamó a useProducts() — no sigue renderizando con datos vacíos/rotos.
    // El mensaje que ves inmediatamente es
    // qué pasó y por qué: "te olvidaste de envolver esto en <ProductsProvider>".
    throw new Error(
      "useProducts debe ser usado dentro de un productProvider"
    );
  }

  // Recién acá, si pasó el guard, devolvés el context ya "garantizado" (no undefined).
  return context;
};