export type DealAnalysisResult = {
    isValidDeal: boolean;
    discountPercentage: number;
    // String invece di enum: flessibilità per messaggi contestuali con valori dinamici
    // (es. "prezzo €99 vs minimo €80"). Un enum richiederebbe template complessi.
    // Il trade-off è perdere type safety sui valori possibili.
    reason: string; //MOTIVAZIONE TESTUALE
    // Flags separati invece di solo isValidDeal: permette ai consumer di capire PERCHÉ
    // un deal è valido/invalido senza parsare la reason string. Utile per filtri UI,
    // analytics, e logica condizionale. Ogni flag rappresenta una dimensione del problema.
    flags:{
        fakeDeal: boolean;
        lowHistory: boolean;
        thirdPartyOnly: boolean;
    }
}