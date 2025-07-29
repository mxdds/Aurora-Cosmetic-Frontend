import {useState} from 'react';
import {ModifyCart} from "../ModifyCart/ModifyCart.tsx";

type ProductData = {
    id: number;
    name: string;
    price: number;
    currency: string;
    image: string;
}
type ProductProps = {
  data: ProductData;
}
const images: Record<string, string> = import.meta.glob("./assets/products");