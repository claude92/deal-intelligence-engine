import products from "../data/mock-products.json";
import { runDealAnalysis } from "./runDealAnalysis";
import { Product } from "../models/Product";

const results = runDealAnalysis(products as Product[]);

results.forEach((r) => {
  console.log("────────────────────────────");
  console.log("PRODOTTO:", r.title);
  console.log("PREZZO:", r.currentPrice, "€");
  console.log("VALIDO:", r.isValidDeal ? "SI ✅" : "NO ❌");
  console.log("SCONTO:", r.discountPercentage + "%");
  console.log("SUMMARY:", r.summary);
});
