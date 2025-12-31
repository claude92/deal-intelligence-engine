# Data - Mock Data

## 🎯 Responsabilità

Questa cartella contiene **dati di test e mock** utilizzati per sviluppo, demo e testing senza dipendere da API esterne.

### File

- **`mock-products.json`**: Dataset di prodotti di esempio
  - Contiene array di `Product` in formato JSON
  - Usato da `MockProductSource`
  - Include vari scenari: fake deals, valid deals, low history, etc.

## ✅ DO (Cosa DEVE fare)

- ✅ Fornire dati realistici per testing
- ✅ Coprire edge cases (fake deals, low history, etc.)
- ✅ Essere in formato JSON compatibile con `Product`
- ✅ Essere utilizzato solo in sviluppo/demo

## ❌ DON'T (Cosa NON DEVE fare)

- ❌ **NON** essere usato in produzione (solo mock)
- ❌ **NON** contenere dati sensibili o reali
- ❌ **NON** essere modificato da codice runtime
- ❌ **NON** essere la fonte di verità per la logica

## 🔗 Dipendenze

**Dipende da:**
- Nessuna

**Usato da:**
- `adapters/MockProductSource.ts` - Legge il JSON
- Test e script di sviluppo

## 📝 Aggiungere Dati Mock

Per aggiungere nuovi prodotti di test:

1. Aprire `mock-products.json`
2. Aggiungere oggetto `Product` valido:
   ```json
   {
     "id": "test-123",
     "title": "Prodotto Test",
     "category": "electronics",
     "currentPrice": 99.99,
     "priceHistory": [
       {"date": "2024-01-01T00:00:00Z", "price": 120.00},
       {"date": "2024-01-15T00:00:00Z", "price": 110.00}
     ],
     "soldByAmazon": true
   }
   ```
3. Assicurarsi che `priceHistory` sia ordinato cronologicamente
4. Testare con `core/testAnalyze.ts` o dashboard

## 🎯 Scenari da Coprire

Il mock dovrebbe includere:
- ✅ **Valid deal**: Prezzo <= minimo storico
- ✅ **Fake deal**: Prezzo gonfiato recentemente
- ✅ **Low history**: < 90 giorni di storico
- ✅ **Third party**: `soldByAmazon: false`
- ✅ **No deal**: Prezzo normale, nessuno sconto significativo

## ⚠️ Limitazioni

- Dati statici (non aggiornati automaticamente)
- Dimensione limitata (non rappresenta dataset reali)
- Nessuna validazione automatica della struttura JSON
- Non sincronizzato con dati reali

