import { runDealAnalysis } from "./runDealAnalysis";
import { MockProductSource } from "../adapters/MockProductSource";

// Entry point CLI: esempio di utilizzo del core senza UI. Utile per:
// - Testing rapido della logica
// - Script automatizzati (cron jobs, webhooks)
// - Debug senza avviare il server React
// In produzione potrebbe accettare argomenti CLI per selezionare adapter o prodotti.
async function main(){
    const source = new MockProductSource();
    const products = await source.getProducts();
    const results = runDealAnalysis(products);
    results.forEach((r)=>{
        console.log("────────────────────────────");
        console.log(r.title);
        console.log(r.summary);
    })
}
main();