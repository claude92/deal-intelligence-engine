export type PricePoint ={
    date: string; // ISO date
    price: number; // EUR
}

export type Product = {
    id: string;
    title: string;
    category: "electronics" | "tech-accessory";
    currentPrice:number;
    priceHistory: PricePoint[];
    soldByAmazon: boolean;
}