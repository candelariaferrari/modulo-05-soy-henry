import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./CartContext";
import { ProductsProvider } from "./ProductsContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>{children}</CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
};