# Models - Type Definitions

## 🎯 Responsabilità

Questa cartella contiene **tutte le definizioni di tipo TypeScript** che rappresentano il dominio del sistema. Sono i contratti condivisi tra tutti i layer.

### Tipi Principali

- **`Product.ts`**: Modello del prodotto
  - `id`, `title`, `category`
  - `currentPrice`, `priceHistory`
  - `soldByAmazon`
  - `PricePoint`: `{date: ISO string, price: number}`

- **`DealAnalysisResult.ts`**: Risultato dell'analisi
  - `isValidDeal`: boolean
  - `discountPercentage`: number
  - `reason`: string (motivazione testuale)
  - `flags`: oggetto con flag booleani

## ✅ DO (Cosa DEVE fare)

- ✅ Definire solo tipi TypeScript (type/interface)
- ✅ Essere condiviso da tutti i layer
- ✅ Rappresentare il dominio del business
- ✅ Essere immutabile (non contiene logica mutante)
- ✅ Essere documentato con commenti JSDoc se necessario

## ❌ DON'T (Cosa NON DEVE fare)

- ❌ **NON** contenere logica di business
- ❌ **NON** contenere funzioni o classi (solo tipi)
- ❌ **NON** dipendere da altri layer (core, adapters, etc.)
- ❌ **NON** contenere valori di default o factory functions
- ❌ **NON** essere specifico per un framework

## 🔗 Dipendenze

**Dipende da:**
- Nessuna dipendenza (solo TypeScript built-in types)

**Usato da:**
- `core/` - Input e output delle funzioni
- `adapters/` - Tipo di ritorno `getProducts()`
- `dashboard/` - Props e state dei componenti
- Tutti i layer del sistema

## 📝 Estendere i Modelli

Per aggiungere nuovi campi o tipi:

1. **Modificare il tipo** in modo backward-compatible quando possibile
2. **Aggiornare tutti i layer** che usano il tipo:
   - Adapters: mappare nuovi campi
   - Core: gestire nuovi campi nell'analisi
   - Dashboard: visualizzare nuovi campi
3. **Considerare versioning** se breaking changes

## 🔄 Flusso dei Dati

```
adapters/ → Product[] → core/ → DealAnalysisResult → dashboard/
```

I modelli sono il "collante" che permette ai layer di comunicare senza conoscersi direttamente.

## ⚠️ Limitazioni

- **Product**: Storico limitato a array in-memory (non scalabile per milioni di punti)
- **DealAnalysisResult**: Flags hardcoded (non estensibile dinamicamente)
- Nessuna validazione runtime (solo type checking a compile-time)
- Nessuna serializzazione/deserializzazione custom

