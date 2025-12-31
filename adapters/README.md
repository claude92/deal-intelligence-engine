# Adapters - Data Source Layer

## 🎯 Responsabilità

Questa cartella gestisce **l'accesso ai dati** da diverse sorgenti. Implementa il pattern **Strategy** per permettere l'intercambiabilità delle sorgenti senza modificare il core.

### Componenti

- **`ProductSource.ts`**: Interfaccia contract
  - Definisce `getProducts(): Promise<Product[]>`
  - Tutti gli adapter devono implementarla

- **`MockProductSource.ts`**: Implementazione mock (attuale)
  - Legge da `data/mock-products.json`
  - Usato per sviluppo e demo

- **`KeepaProductSource.ts`**: Adapter futuro per API Keepa
  - TODO: implementazione
  - Normalizzerà dati Keepa → `Product[]`

## ✅ DO (Cosa DEVE fare)

- ✅ Implementare `ProductSource` interface
- ✅ Normalizzare dati esterni al modello `Product`
- ✅ Gestire errori di I/O e retry logic
- ✅ Essere intercambiabile con altri adapter
- ✅ Validare dati prima di restituirli

## ❌ DON'T (Cosa NON DEVE fare)

- ❌ **NON** contenere logica di business (analisi, calcoli)
- ❌ **NON** dipendere da `core/` (solo da `models/`)
- ❌ **NON** gestire UI o rendering
- ❌ **NON** fare assunzioni su come i dati verranno usati
- ❌ **NON** modificare il modello `Product` (solo mappare)

## 🔗 Dipendenze

**Dipende da:**
- `models/Product.ts` - Per il tipo di ritorno
- `data/` - Solo per MockProductSource

**Usato da:**
- `core/runWithSource.ts` - CLI
- `dashboard/` - React UI
- Qualsiasi consumer che necessita dati

## 📝 Aggiungere un Nuovo Adapter

Per integrare una nuova sorgente dati:

1. **Creare file**: `NewSourceProductSource.ts`
2. **Implementare interface**:
   ```typescript
   export class NewSourceProductSource implements ProductSource {
     async getProducts(): Promise<Product[]> {
       // 1. Chiamare API/scraping
       // 2. Normalizzare dati → Product[]
       // 3. Validare e restituire
     }
   }
   ```
3. **Mappare dati esterni** al modello `Product`:
   - `id`, `title`, `category`
   - `currentPrice`
   - `priceHistory: PricePoint[]`
   - `soldByAmazon: boolean`
4. **Gestire errori**: Retry, fallback, logging

## 🔄 Pattern di Utilizzo

```typescript
// Consumer può cambiare adapter facilmente
const source = new MockProductSource(); // o KeepaProductSource()
const products = await source.getProducts();
const results = runDealAnalysis(products);
```

## ⚠️ Limitazioni Attuali

- **MockProductSource**: Solo dati statici da JSON
- **KeepaProductSource**: Non implementato (TODO)
- Nessuna gestione di cache o rate limiting
- Nessuna validazione avanzata dei dati esterni

