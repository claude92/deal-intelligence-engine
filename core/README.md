# Core - Business Logic Layer

## 🎯 Responsabilità

Questa cartella contiene **tutta la logica di business** per l'analisi dei deal. È il cuore del sistema e deve rimanere **completamente indipendente** da framework, UI e sorgenti dati esterne.

### Funzioni Principali

- **`analyzeDeal.ts`**: Algoritmo centrale di analisi
  - Analizza storico prezzi (90 giorni e 14 giorni)
  - Rileva fake deals attraverso euristiche
  - Calcola metriche (min, avg, max, discount)
  - Genera `DealAnalysisResult` con flags e motivazioni

- **`runDealAnalysis.ts`**: Orchestratore batch
  - Processa array di prodotti
  - Applica `analyzeDeal` a ogni prodotto
  - Formatta output per consumers (`DealOutput[]`)

- **`buildDecisionSummary.ts`**: Formattazione decisionale
  - Converte risultato tecnico in messaggio utente-friendly
  - Priorità: fakeDeal > thirdPartyOnly > lowHistory > isValidDeal

- **`runWithSource.ts`**: Entry point CLI
  - Esempio di utilizzo del core con adapter
  - Può essere rimosso se non necessario

- **`testAnalyze.ts`**: Test manuale
  - Script di debug/verifica
  - Non fa parte dell'API pubblica

## ✅ DO (Cosa DEVE fare)

- ✅ Contenere solo logica pura (pure functions)
- ✅ Essere testabile senza dipendenze esterne
- ✅ Accettare `Product` come input (modello di dominio)
- ✅ Restituire `DealAnalysisResult` o `DealOutput`
- ✅ Essere riutilizzabile da qualsiasi consumer (React, CLI, API, etc.)

## ❌ DON'T (Cosa NON DEVE fare)

- ❌ **NON** importare da `adapters/` o `dashboard/`
- ❌ **NON** dipendere da framework (React, Express, etc.)
- ❌ **NON** fare chiamate HTTP o I/O
- ❌ **NON** gestire UI o rendering
- ❌ **NON** accedere direttamente a file system (tranne test/debug)
- ❌ **NON** contenere configurazione o environment variables

## 🔗 Dipendenze

**Dipende da:**
- `models/` - Solo type definitions (`Product`, `DealAnalysisResult`)

**Usato da:**
- `dashboard/` - React UI
- `adapters/` - Potenzialmente (se adapter fa preprocessing)
- CLI scripts - `runWithSource.ts`

## 📝 Estendibilità

Per aggiungere nuove logiche di analisi:

1. **Nuovo algoritmo**: Creare `analyzeDealV2.ts` mantenendo compatibilità
2. **Nuove metriche**: Estendere `DealAnalysisResult` in `models/`
3. **Nuovi formatter**: Aggiungere `buildSummaryV2.ts` se necessario
4. **Test**: Aggiungere test unitari senza dipendenze esterne

## 🧪 Testabilità

Il core è progettato per essere testato in isolamento:

```typescript
// Esempio test
import { analyzeDeal } from './analyzeDeal';
import { Product } from '../models/Product';

const mockProduct: Product = { /* ... */ };
const result = analyzeDeal(mockProduct);
// Assert su result senza mock di I/O o framework
```

