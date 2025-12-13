import { Product } from "../models/Product";
import { analyzeDeal } from "./analyzeDeal";
import { buildDecisionSummary } from "./buildDecisionSummary";

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
            discountPercentage: Number(result.discountPercentage.toFixed(1)),
            summary: buildDecisionSummary(result),
        }
    })
}