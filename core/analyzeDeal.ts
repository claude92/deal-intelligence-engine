import type { Product } from "../models/Product.js";
import type { DealAnalysisResult } from "../models/DealAnalysisResult.js";

export function analyzeDeal(product: Product): DealAnalysisResult {
    const now = new Date();

    const diffDays = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

    // 90 giorni: periodo sufficiente per catturare variazioni stagionali e trend reali,
    // ma abbastanza recente da essere rilevante. Periodi più lunghi includono troppi
    // cambiamenti strutturali (inflazione, cambio modello), più corti non catturano pattern.
    const priceHistory90d = product.priceHistory.filter(p => {
        const priceDate = new Date(p.date);
        return diffDays(now, priceDate) <= 90;
    });

    // 14 giorni: finestra tipica per manipolazioni di prezzo. I venditori gonfiano il prezzo
    // poco prima di uno "sconto" per creare l'illusione di un affare. 2 settimane è il tempo
    // minimo per non sembrare sospetto ma sufficiente per influenzare la percezione.
    const priceHistory14d = product.priceHistory.filter(p => {
        const priceDate = new Date(p.date);
        return diffDays(now, priceDate) <= 14;
    });

    const lowHistory = priceHistory90d.length === 0;

    // Usiamo currentPrice come fallback quando manca storico: meglio un'analisi parziale
    // che fallire completamente. Permette di processare prodotti nuovi senza bloccare il sistema.
    const min90d = lowHistory ? product.currentPrice : Math.min(...priceHistory90d.map(p => p.price));
    const avg90d = lowHistory ? product.currentPrice : priceHistory90d.reduce((sum, p) => sum + p.price, 0) / priceHistory90d.length;

    const max14d = priceHistory14d.length === 0 ? product.currentPrice : Math.max(...priceHistory14d.map(p => p.price));

    // Sconto vs media (non vs minimo): la media è più robusta ai picchi anomali e rappresenta
    // meglio il "prezzo normale" che l'utente si aspetta. Il minimo può essere un outlier.
    const discountVsAvg = avg90d > 0 ? 100 * (avg90d - product.currentPrice) / avg90d : 0;
    
    // Euristica fake deal:
    // - 1.15 (15%): soglia per distinguere variazioni normali da manipolazioni intenzionali.
    //   Variazioni <15% sono comuni, >15% in 2 settimane sono sospette.
    // - 1.02 (2%): tolleranza per fluttuazioni minime. Se il prezzo è tornato al minimo storico
    //   (entro 2%), significa che il "sconto" è solo il ritorno al prezzo normale dopo il gonfiaggio.
    const fakeDeal = (max14d > min90d * 1.15) && (product.currentPrice <= min90d * 1.02);

    // Soglia 30%: sconto significativo che giustifica l'acquisto. Sotto il 30% non è un "affare"
    // ma una normale variazione di prezzo. Il minimo storico è sempre valido (anche se sconto <30%).
    let isValidDeal = false;
    if (!lowHistory && (product.currentPrice <= min90d || discountVsAvg >= 30)) {
        isValidDeal = true;
    }

    // Veto assoluto su fake deals: anche se tecnicamente il prezzo è basso, la manipolazione
    // intenzionale rende il deal inaccettabile. Priorità alla trasparenza rispetto al prezzo.
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