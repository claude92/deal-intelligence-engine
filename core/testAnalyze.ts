import products from "../data/mock-products.json";
import { analyzeDeal } from "./analyzeDeal";
import type { Product } from "../models/Product";
import { buildDecisionSummary } from "./buildDecisionSummary";


(products as Product[]).forEach((product) => {
  const result = analyzeDeal(product);

  console.log("────────────────────────────");
  console.log("PRODOTTO:", product.title);
  console.log("PREZZO ATTUALE:", product.currentPrice, "€");
  console.log("RISULTATO:", result.isValidDeal ? "VALID DEAL ✅" : "NON VALIDO ❌");
  console.log("SCONTO:", result.discountPercentage + "%");
  console.log("MOTIVO:", result.reason);
  console.log("FLAGS:", result.flags);
  console.log("SUMMARY:", buildDecisionSummary(result));

});
