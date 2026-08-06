export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string; // porque va a estar guardada en aws , va a ser una url
  description: string;
  stock: number
};
