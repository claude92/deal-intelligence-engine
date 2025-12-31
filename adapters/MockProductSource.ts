import type { ProductSource } from "./ProductSource";
import type { Product } from "../models/Product";
import products from "../data/mock-products.json";

// Classe invece di funzione: mantiene consistenza con adapter futuri (KeepaProductSource)
// che potrebbero avere stato (cache, rate limiting). Permette anche dependency injection
// e testing più semplice (mock dell'intera classe).
export class MockProductSource implements ProductSource {
    // Async anche se legge da file statico: rispetta il contratto ProductSource che è
    // asincrono per supportare adapter con I/O reale. Evita cambiamenti breaking quando
    // si passa da mock a adapter reali.
    async getProducts(): Promise<Product[]> {
        return products as Product[];
    }
}