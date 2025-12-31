import type { DealAnalysisResult } from "../models/DealAnalysisResult";

export function buildDecisionSummary(result: DealAnalysisResult): string {
  // Priorità: fakeDeal > thirdPartyOnly > lowHistory > isValidDeal
  // Questa gerarchia riflette la gravità dei problemi: la manipolazione intenzionale (fakeDeal)
  // è peggio di un venditore terzo, che è peggio di dati insufficienti, che è peggio di
  // semplicemente "non un affare". L'utente deve vedere prima i problemi più gravi.
  if (result.flags.fakeDeal) {
    return "Scartato: il prezzo sembra essere stato gonfiato artificialmente nelle ultime settimane e ora scontato per simulare un affare.";
  }

  // Venditori terzi hanno politiche di prezzo meno trasparenti e possono ritirare offerte.
  // Amazon diretto offre maggiore affidabilità e protezione acquirente.
  if (result.flags.thirdPartyOnly) {
    return "Scartato: il prodotto non è venduto direttamente da Amazon, condizione che riduce l'affidabilità dello sconto.";
  }

  // Senza storico sufficiente non possiamo distinguere un vero sconto da una normale
  // variazione. Meglio essere conservativi e non rischiare di consigliare un falso affare.
  if (result.flags.lowHistory) {
    return "Scartato: lo storico dei prezzi è troppo breve per valutare se lo sconto sia reale.";
  }

  if (result.isValidDeal) {
    return `Affare valido: sconto reale del ${result.discountPercentage.toFixed(
      1
    )}% rispetto ai prezzi storici.`;
  }

  // Caso di fallback: nessun red flag ma anche nessun affare reale. Il prezzo è normale.
  return "Nessun vero affare: lo sconto attuale non è sufficientemente significativo rispetto allo storico dei prezzi.";
}
