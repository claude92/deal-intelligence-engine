import type { DealOutput } from "../../../core/runDealAnalysis";

type Props = {
    deal: DealOutput;
}

// Component separato invece di inline: riusabilità e testabilità. Se in futuro serve
// una versione compatta o dettagliata, basta creare varianti senza toccare Dashboard.
export function DealCard({ deal }: Props) {
    return (
        <div
            style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <h3>{deal.title}</h3>
            <p>Prezzo attuale: {deal.currentPrice} €</p>
            <p>Sconto: {deal.discountPercentage}%</p>

            <p>
                {/* Colori semantici: verde per validi (go), rosso per non validi (stop).
                    Feedback visivo immediato prima ancora di leggere il testo. */}
                <span
                    style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        background: deal.isValidDeal ? "#e6f7ee" : "#fdecea",
                        color: deal.isValidDeal ? "#137333" : "#b3261e",
                    }}
                >
                    {deal.isValidDeal ? "VALID DEAL" : "NON VALIDO"}
                </span>

            </p>
            <p>{deal.summary}</p>
        </div>
    )
}