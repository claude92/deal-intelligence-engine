import { Product } from "../models/Product";

export interface ProductSource {
    getProducts(): Promise<Product[]>;
}