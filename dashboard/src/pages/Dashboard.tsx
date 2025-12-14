import { useState, useEffect } from "react";
import { MockProductSource } from "../../../adapters/MockProductSource";
import { runDealAnalysis } from "../../../core/runDealAnalysis";
import type { DealOutput } from "../../../core/runDealAnalysis";
import { DealCard } from "../components/DealCard";

export function Dashboard() {
    const [deals, setDeals] = useState<DealOutput[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const source = new MockProductSource();
            const products = await source.getProducts();
            const results = runDealAnalysis(products).sort((a, b) => Number(b.isValidDeal) - Number(a.isValidDeal));
            setDeals(results);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return <p style={{ padding: 24 }}>Caricamento analisi...</p>
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>Deal Intelligence Dashboard</h1>
            <p>Analisi automatica di sconti e fake deals</p>
            {deals.length === 0 && (
                <p>Nessun prodotto analizzato al momento.</p>
            )}
            {deals.map((deal) => (
                <DealCard key={deal.productId} deal={deal} />
            ))}
        </div>
    )
}

