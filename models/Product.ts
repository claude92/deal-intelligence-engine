// PricePoint separato: permette di estendere in futuro (es. aggiungere source, currency)
// senza modificare Product. Inoltre rende esplicita la struttura temporale dei dati.
export type PricePoint ={
    date: string; // ISO date
    price: number; // EUR
}

export type Product = {
    id: string;
    title: string;
    // Union type limitato invece di string: type safety. Se aggiungiamo categorie, TypeScript
    // ci avvisa di tutti i punti che devono essere aggiornati. In futuro potrebbe essere
    // un enum o venire da una lista esterna.
    category: "electronics" | "tech-accessory";
    currentPrice:number;
    // Array invece di Map/oggetto: semplice da serializzare (JSON) e iterare. Per dataset
    // piccoli (<1000 punti) è efficiente. Per scale maggiori potremmo usare strutture
    // ottimizzate (es. time-series DB), ma per ora la semplicità vince.
    priceHistory: PricePoint[];
    // Boolean esplicito invece di venditore opzionale: decisione binaria chiara. "Venduto
    // da Amazon" è un fattore di fiducia critico, non un dettaglio opzionale.
    soldByAmazon: boolean;
}