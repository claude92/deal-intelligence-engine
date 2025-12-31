import type { Product } from "../models/Product";
import { analyzeDeal } from "./analyzeDeal";
import { buildDecisionSummary } from "./buildDecisionSummary";

// DealOutput è un subset di Product + risultato analisi, progettato per i consumer.
// Non esponiamo tutto Product per evitare che i consumer dipendano da dettagli interni
// (es. priceHistory, category) che potrebbero cambiare. Solo i dati necessari per la UI.
export type DealOutput = {
    productId: string;
    title: string;
    currentPrice: number;
    isValidDeal: boolean;
    discountPercentage: number;
    summary: string;
}

export function runDealAnalysis(products: Product[]): DealOutput[] {
    return products.map((product)=>{
        const result = analyzeDeal(product);
        return {
            productId: product.id,
            title: product.title,
            currentPrice: product.currentPrice,
            isValidDeal: result.isValidDeal,
            // Arrotondamento a 1 decimale: sufficiente per l'utente (es. "23.5%") e evita
            // precisione eccessiva che potrebbe sembrare falsamente accurata.
            discountPercentage: Number(result.discountPercentage.toFixed(1)),
            summary: buildDecisionSummary(result),
        }
    })
}