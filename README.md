# Deal Intelligence Engine

Motore di analisi dei prezzi progettato per individuare **sconti realmente convenienti**
ed escludere **fake deals** basati su manipolazioni dello storico prezzi.
Il progetto è costruito attorno a un **core riutilizzabile**, indipendente dalla UI.

---

## 🎯 Problema

Molti sconti online sono solo apparenti:
il prezzo viene aumentato artificialmente nelle settimane precedenti
per poi essere “scontato” e simulare un affare.

L’utente finale non ha strumenti immediati per capire se uno sconto
sia realmente conveniente rispetto allo storico.

---

## 💡 Soluzione

Questo progetto analizza lo storico dei prezzi di un prodotto per:
- confrontare il prezzo attuale con minimi e medie storiche
- individuare pattern di **fake deals**
- restituire un giudizio motivato sulla validità dell’offerta

L’obiettivo non è mostrare dati grezzi,
ma **supportare una decisione**.

---

## 🏗️ Architettura

Il sistema è progettato seguendo un approccio **domain-first**:

- **Core decisionale indipendente**
  - Contiene tutta la logica di analisi e validazione dei deal
  - Non dipende da framework o UI

- **Adapters**
  - Gestiscono le sorgenti dati (mock, Keepa in futuro)
  - Permettono di sostituire facilmente la fonte senza modificare il core

- **Consumers**
  - React Dashboard
  - Custom GPT
  - Qualsiasi altro client futuro

Questa separazione consente **riuso, testabilità ed estensione** del sistema.

---

## ⚙️ Tecnologie

- TypeScript
- React
- Tailwind CSS
- Architettura a livelli (Core / Adapters / UI)

---

## 📊 Stato del progetto

La demo attuale utilizza **dati mock**
per mostrare il funzionamento della logica di dominio
senza dipendere da API esterne.

L’architettura è progettata per l’integrazione futura
con API reali (es. Keepa).

---

## 🚀 Perché questo progetto è utile

- Può essere riutilizzato come **libreria di analisi prezzi**
- È estendibile con sorgenti dati reali
- Costituisce una base per:
  - automazioni affiliate
  - sistemi di alerting
  - strumenti di supporto decisionale

---
