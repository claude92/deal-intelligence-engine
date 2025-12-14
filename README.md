# Deal Intelligence Engine

Sistema di analisi dei prezzi progettato per identificare sconti reali ed escludere fake deals,
con architettura a core riutilizzabile.

## Problema
I prezzi online spesso mostrano sconti apparenti basati su rialzi artificiali precedenti.
Questo progetto mira a distinguere sconti reali da quelli ingannevoli.

## Architettura
- Core decisionale indipendente
- Adapter per diverse sorgenti dati (mock / Keepa)
- Consumer multipli (React Dashboard, Custom GPT)

## Tecnologie
- TypeScript
- React
- Architettura a livelli (Core / Adapters / UI)

## Nota
La demo utilizza dati mock per mostrare la logica senza dipendere da API esterne.
