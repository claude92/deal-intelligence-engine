import { ProductSource } from "./ProductSource";
import { Product } from "../models/Product";

export class KeepaProductSource implements ProductSource {
    async getProducts(): Promise<Product[]> {
        // TODO:
        // 1. chiamare API Keepa
        // 2. normalizzare i dati
        // 3. mappare sul Product model
        throw new Error("Keepa adapter not implemented yet");
    }
}