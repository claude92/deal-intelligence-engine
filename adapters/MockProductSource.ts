import type { ProductSource } from "./ProductSource";
import type { Product } from "../models/Product";
import products from "../data/mock-products.json";

export class MockProductSource implements ProductSource {
    async getProducts(): Promise<Product[]> {
        return products as Product[];
    }
}