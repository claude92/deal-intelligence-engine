import { runDealAnalysis } from "./runDealAnalysis";
import { MockProductSource } from "../adapters/MockProductSource";

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