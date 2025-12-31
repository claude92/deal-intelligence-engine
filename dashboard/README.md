# Dashboard - React UI Consumer

## 🎯 Responsabilità

Questa cartella contiene l'**interfaccia utente React** che consuma il core di analisi. È un consumer del sistema, non contiene logica di business.

### Struttura

- **`src/pages/Dashboard.tsx`**: Pagina principale
  - Carica prodotti tramite adapter
  - Chiama `runDealAnalysis` dal core
  - Visualizza risultati con `DealCard`

- **`src/components/DealCard.tsx`**: Componente di visualizzazione
  - Mostra informazioni prodotto
  - Evidenzia deal validi/invalidi
  - Display di summary e flags

- **`src/App.tsx`**: Root component
- **`src/main.tsx`**: Entry point Vite

## ✅ DO (Cosa DEVE fare)

- ✅ Consumare `core/runDealAnalysis` per ottenere risultati
- ✅ Usare `adapters/ProductSource` per caricare dati
- ✅ Visualizzare risultati in modo user-friendly
- ✅ Gestire stati di loading ed errori
- ✅ Essere un consumer passivo (non modifica logica)

## ❌ DON'T (Cosa NON DEVE fare)

- ❌ **NON** contenere logica di analisi (usa il core)
- ❌ **NON** fare calcoli su prezzi o metriche
- ❌ **NON** modificare il modello `Product` o `DealAnalysisResult`
- ❌ **NON** accedere direttamente a file system o API (usa adapters)
- ❌ **NON** dipendere da altri consumers

## 🔗 Dipendenze

**Dipende da:**
- `../core/` - Per `runDealAnalysis`
- `../adapters/` - Per `MockProductSource` (o altri)
- `../models/` - Per tipi TypeScript

**Usato da:**
- Utenti finali (browser)
- Build process (Vite)

## 🛠️ Tecnologie

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool e dev server
- **CSS**: Styling (inline styles attualmente)

## 📝 Scripts

```bash
npm run dev      # Dev server (localhost:5173)
npm run build    # Build produzione → dist/
npm run preview  # Preview build
npm run lint     # ESLint
```

## 🔄 Flusso di Esecuzione

```
1. Dashboard.tsx monta
2. useEffect → MockProductSource.getProducts()
3. runDealAnalysis(products) dal core
4. Risultati → DealCard components
5. Rendering UI
```

## 📁 Struttura

```
dashboard/
├── src/
│   ├── pages/
│   │   └── Dashboard.tsx      # Pagina principale
│   ├── components/
│   │   └── DealCard.tsx       # Card prodotto
│   ├── App.tsx                # Root
│   └── main.tsx               # Entry
├── public/                    # Assets statici
├── dist/                      # Build output
└── package.json               # Dipendenze React/Vite
```

## ⚠️ Limitazioni

- **Styling**: Attualmente inline styles (non Tailwind come menzionato)
- **State management**: Solo useState locale (no Redux/Zustand)
- **Error handling**: Base (no error boundaries avanzati)
- **Routing**: Single page (no React Router)
- **Testing**: Nessun test configurato

## 🚀 Estendibilità

Per aggiungere nuove features UI:

1. **Nuove pagine**: Aggiungere in `src/pages/`
2. **Nuovi componenti**: Aggiungere in `src/components/`
3. **Routing**: Installare React Router se necessario
4. **State globale**: Aggiungere Context API o Zustand
5. **Styling**: Migrare a Tailwind CSS o altro framework
