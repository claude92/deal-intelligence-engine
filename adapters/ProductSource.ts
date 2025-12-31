import type { Product } from "../models/Product";

// Interface invece di classe astratta: più flessibile, permette implementazioni con
// funzioni factory o oggetti semplici. TypeScript garantisce il contratto senza
// vincolare l'implementazione a una gerarchia di classi.
export interface ProductSource {
    // Promise anche se alcuni adapter sono sincroni: permette di aggiungere adapter
    // asincroni (API, database) senza cambiare la firma. MockProductSource può
    // semplicemente fare `return Promise.resolve(products)`.
    getProducts(): Promise<Product[]>;
}