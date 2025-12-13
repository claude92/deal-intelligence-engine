import type { Product } from "../models/Product.js";
import type { DealAnalysisResult } from "../models/DealAnalysisResult.js";

export function analyzeDeal(product: Product): DealAnalysisResult {
    // Estrai la data corrente
    const now = new Date();

    // Funzione di utilità per calcolare la differenza di giorni tra due date
    const diffDays = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

    // Filtro cronologico: seleziona prezzi negli ultimi 90 giorni
    const priceHistory90d = product.priceHistory.filter(p => {
        const priceDate = new Date(p.date);
        return diffDays(now, priceDate) <= 90;
    });

    // Filtro prezzi negli ultimi 14 giorni (per rilevamento fake deal)
    const priceHistory14d = product.priceHistory.filter(p => {
        const priceDate = new Date(p.date);
        return diffDays(now, priceDate) <= 14;
    });

    // Verifica presenza di almeno 90 giorni di storico
    const lowHistory = priceHistory90d.length === 0;

    // Calcola prezzo minimo e medio negli ultimi 90 giorni
    const min90d = lowHistory ? product.currentPrice : Math.min(...priceHistory90d.map(p => p.price));
    const avg90d = lowHistory ? product.currentPrice : priceHistory90d.reduce((sum, p) => sum + p.price, 0) / priceHistory90d.length;

    // Calcola prezzo massimo negli ultimi 14 giorni
    const max14d = priceHistory14d.length === 0 ? product.currentPrice : Math.max(...priceHistory14d.map(p => p.price));

    // Calcola sconto attuale rispetto al prezzo medio 90 giorni e minimo 90 giorni
    const discountVsAvg = avg90d > 0 ? 100 * (avg90d - product.currentPrice) / avg90d : 0;
    const discountVsMin = min90d > 0 ? 100 * (min90d - product.currentPrice) / min90d : 0;

    // Fake deal: prezzo corrente gonfiato se negli ultimi 14 giorni il prezzo è stato significativamente più alto del minimo 90d e ora abbassato
    // Semplice euristica: se max14d > min90d * 1.15 && currentPrice ~ min90d
    const fakeDeal = (max14d > min90d * 1.15) && (product.currentPrice <= min90d * 1.02);

    // Condizione di "vero affare": prezzo <= minimo storico 90 giorni o sconto >= 30% rispetto a media 90 giorni
    let isValidDeal = false;
    if (!lowHistory && (product.currentPrice <= min90d || discountVsAvg >= 30)) {
        isValidDeal = true;
    }

    // Se fakeDeal è true, il deal non può mai essere valido
    if (fakeDeal) {
        isValidDeal = false;
    }

    // "Solo terze parti": flag se non venduto da Amazon
    const thirdPartyOnly = !product.soldByAmazon;

    // Motivo testuale
    let reason = "";
    if (lowHistory) {
        reason = "Storico prezzi troppo breve (<90 giorni) per valutare l'affare.";
    } else if (fakeDeal) {
        reason = "Deal scartato: prezzo gonfiato artificialmente nelle ultime due settimane e ora scontato per simulare un affare. Il prezzo attuale non rappresenta un vero sconto.";
    } else if (!isValidDeal) {
        reason = `Nessun vero affare: prezzo attuale €${product.currentPrice.toFixed(2)}, minimo 90 giorni €${min90d.toFixed(2)}, media 90 giorni €${avg90d.toFixed(2)}. Sconto troppo basso.`;
    } else {
        reason = `Ottimo prezzo: prezzo attuale €${product.currentPrice.toFixed(2)}, minimo 90 giorni €${min90d.toFixed(2)}, media 90 giorni €${avg90d.toFixed(2)}.`;
    }

    return {
        isValidDeal,
        discountPercentage: discountVsAvg,
        reason,
        flags: {
            fakeDeal,
            lowHistory,
            thirdPartyOnly,
        }
    }
}