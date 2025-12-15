import type { DealAnalysisResult } from "../models/DealAnalysisResult";

export function buildDecisionSummary(result: DealAnalysisResult): string {
  // Caso 1: fake deal (veto assoluto)
  if (result.flags.fakeDeal) {
    return "Scartato: il prezzo sembra essere stato gonfiato artificialmente nelle ultime settimane e ora scontato per simulare un affare.";
  }

  // Caso 2: venditore terzo
  if (result.flags.thirdPartyOnly) {
    return "Scartato: il prodotto non è venduto direttamente da Amazon, condizione che riduce l’affidabilità dello sconto.";
  }

  // Caso 3: storico insufficiente
  if (result.flags.lowHistory) {
    return "Scartato: lo storico dei prezzi è troppo breve per valutare se lo sconto sia reale.";
  }

  // Caso 4: valido
  if (result.isValidDeal) {
    return `Affare valido: sconto reale del ${result.discountPercentage.toFixed(
      1
    )}% rispetto ai prezzi storici.`;
  }

  // Caso 5: non valido ma senza red flag
  return "Nessun vero affare: lo sconto attuale non è sufficientemente significativo rispetto allo storico dei prezzi.";
}
