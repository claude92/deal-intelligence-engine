# Deal Intelligence Engine

Sistema di analisi intelligente dei prezzi per rilevare **fake deals** e identificare sconti realmente convenienti basati sullo storico dei prezzi.

## 🏗️ Architettura

Architettura a **3 livelli** con separazione delle responsabilità:

```
┌─────────────────────────────────────────┐
│         Consumers (UI Layer)            │
│  ┌──────────────┐  ┌──────────────┐    │
│  │   Dashboard  │  │  CLI/Others│    │
│  │   (React)    │  │              │    │
│  └──────┬───────┘  └──────┬───────┘    │
└─────────┼─────────────────┼────────────┘
          │                 │
┌─────────▼─────────────────▼────────────┐
│         Core (Business Logic)          │
│  ┌──────────────────────────────────┐ │
│  │  analyzeDeal()                   │ │
│  │  runDealAnalysis()               │ │
│  │  buildDecisionSummary()          │ │
│  └──────────────────────────────────┘ │
└─────────┬─────────────────────────────┘
          │
┌─────────▼─────────────────────────────┐
│      Adapters (Data Sources)          │
│  ┌──────────────┐  ┌──────────────┐  │
│  │     Mock     │  │    Keepa     │  │
│  │ ProductSource│  │ ProductSource│  │
│  └──────────────┘  └──────────────┘  │
└───────────────────────────────────────┘
```

### Layer 1: Core (`/core`)
**Logica di business indipendente** - nessuna dipendenza da framework o UI.

- **`analyzeDeal.ts`**: Algoritmo principale di analisi
  - Analizza storico 90 giorni (min/avg) e 14 giorni (max)
  - Rileva fake deals: `max14d > min90d * 1.15 && currentPrice ~ min90d`
  - Valida deal: `price <= min90d || discount >= 30%`
  
- **`runDealAnalysis.ts`**: Orchestratore batch
  - Processa array di prodotti
  - Genera output strutturato (`DealOutput[]`)

- **`buildDecisionSummary.ts`**: Formattazione decisionale
  - Converte risultato tecnico in messaggio utente

### Layer 2: Adapters (`/adapters`)
**Interfaccia per sorgenti dati** - pattern Strategy per intercambiabilità.

- **`ProductSource.ts`**: Interfaccia
  ```typescript
  interface ProductSource {
    getProducts(): Promise<Product[]>
  }
  ```

- **`MockProductSource.ts`**: Implementazione mock (attuale)
- **`KeepaProductSource.ts`**: Adapter futuro per API Keepa

### Layer 3: Consumers (`/dashboard`)
**Interfacce utente** - consumano il core senza modificarlo.

- **React Dashboard**: Visualizzazione prodotti e analisi
- **CLI** (`runWithSource.ts`): Esecuzione da terminale

## 📊 Modelli di Dati

### `Product`
```typescript
{
  id: string
  title: string
  category: "electronics" | "tech-accessory"
  currentPrice: number
  priceHistory: PricePoint[]  // [{date: ISO, price: number}]
  soldByAmazon: boolean
}
```

### `DealAnalysisResult`
```typescript
{
  isValidDeal: boolean
  discountPercentage: number
  reason: string
  flags: {
    fakeDeal: boolean      // Prezzo gonfiato artificialmente
    lowHistory: boolean    // Storico < 90 giorni
    thirdPartyOnly: boolean // Non venduto da Amazon
  }
}
```

## 🔄 Flusso di Esecuzione

```
1. Consumer → ProductSource.getProducts()
2. ProductSource → Product[]
3. Consumer → runDealAnalysis(products)
4. Core → analyzeDeal(product) per ogni prodotto
5. Core → buildDecisionSummary(result)
6. Consumer → DealOutput[] (visualizzazione)
```

## 🎯 Algoritmo di Analisi

1. **Filtro temporale**: Ultimi 90 giorni (analisi) e 14 giorni (fake detection)
2. **Calcolo metriche**:
   - `min90d`: Prezzo minimo ultimi 90 giorni
   - `avg90d`: Prezzo medio ultimi 90 giorni
   - `max14d`: Prezzo massimo ultimi 14 giorni
3. **Rilevamento fake deal**: `max14d > min90d * 1.15 && currentPrice <= min90d * 1.02`
4. **Validazione deal**: `price <= min90d || discount >= 30%` (se non fake)
5. **Flags**: lowHistory, thirdPartyOnly, fakeDeal

## 🛠️ Tecnologie

- **TypeScript 5.9**: Type safety e modularità
- **React 19**: Dashboard UI
- **Vite**: Build tool per dashboard
- **Architettura a livelli**: Core indipendente, adattatori intercambiabili

## 📁 Struttura Progetto

```
deal-intelligence/
├── core/              # Logica di business (indipendente)
│   ├── analyzeDeal.ts
│   ├── runDealAnalysis.ts
│   └── buildDecisionSummary.ts
├── adapters/          # Sorgenti dati (Strategy pattern)
│   ├── ProductSource.ts (interface)
│   ├── MockProductSource.ts
│   └── KeepaProductSource.ts (TODO)
├── models/            # Type definitions
│   ├── Product.ts
│   └── DealAnalysisResult.ts
├── dashboard/         # React UI consumer
│   └── src/
└── data/              # Mock data
    └── mock-products.json
```

## 🚀 Estendibilità

- **Nuove sorgenti dati**: Implementare `ProductSource` (es. Amazon API, scraping)
- **Nuovi consumers**: Importare `runDealAnalysis` da `/core`
- **Algoritmi alternativi**: Estendere `analyzeDeal` o creare varianti
- **Export formati**: Aggiungere formatter in `/core` (JSON, CSV, etc.)

## 📝 Stato Attuale

- ✅ Core logic implementato e testato
- ✅ Mock adapter funzionante
- ✅ React dashboard operativa
- ⏳ Keepa adapter (TODO)
- ⏳ Test suite (TODO)
