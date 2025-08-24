export interface ProductData {
    id: string;
    name: string;
    price: number;
    currency: string;
    image: string;
    description: string;
    category: string;

    filter(param: (product) => boolean): string;
}