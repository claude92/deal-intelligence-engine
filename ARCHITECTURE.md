# Architettura del Sistema - Diagramma

## Diagramma Architetturale

```mermaid
flowchart TB
    subgraph "Consumer Layer"
        Dashboard["`**Dashboard**<br/>(React UI)`"]
        CLI["`**CLI**<br/>(runWithSource.ts)`"]
    end

    subgraph "Core Layer (Business Logic)"
        direction TB
        runAnalysis["`**runDealAnalysis**<br/>Orchestratore batch`"]
        analyzeDeal["`**analyzeDeal**<br/>Algoritmo principale`"]
        buildSummary["`**buildDecisionSummary**<br/>Formattazione`"]
        
        runAnalysis --> analyzeDeal
        runAnalysis --> buildSummary
    end

    subgraph "Adapter Layer (Data Sources)"
        direction TB
        ProductSource["`**ProductSource**<br/>(Interface)`"]
        MockSource["`**MockProductSource**<br/>(Implementazione)`"]
        KeepaSource["`**KeepaProductSource**<br/>(TODO)`"]
        
        MockSource -.->|implements| ProductSource
        KeepaSource -.->|implements| ProductSource
    end

    subgraph "Models Layer (Type Definitions)"
        direction LR
        Product["`**Product**<br/>Modello dominio`"]
        DealResult["`**DealAnalysisResult**<br/>Risultato analisi`"]
        DealOutput["`**DealOutput**<br/>Output consumer`"]
    end

    subgraph "Data Layer"
        MockData["`**mock-products.json**<br/>Dati di test`"]
    end

    %% Dipendenze Consumer -> Core
    Dashboard -->|usa| runAnalysis
    CLI -->|usa| runAnalysis
    
    %% Dipendenze Consumer -> Adapters
    Dashboard -->|istanzia| MockSource
    CLI -->|istanzia| MockSource
    
    %% Dipendenze Core -> Models
    analyzeDeal -->|input| Product
    analyzeDeal -->|output| DealResult
    runAnalysis -->|output| DealOutput
    buildSummary -->|input| DealResult
    
    %% Dipendenze Adapters -> Models
    ProductSource -->|ritorna| Product
    MockSource -->|legge| MockData
    
    %% Flusso di esecuzione
    Dashboard -.->|"1. getProducts()"| MockSource
    MockSource -.->|"2. Product[]"| Dashboard
    Dashboard -.->|"3. runDealAnalysis()"| runAnalysis
    runAnalysis -.->|"4. analyzeDeal()"| analyzeDeal
    analyzeDeal -.->|"5. DealAnalysisResult"| runAnalysis
    runAnalysis -.->|"6. DealOutput[]"| Dashboard

    %% Stili
    classDef consumer fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef core fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef adapter fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef model fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef data fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef interface stroke-dasharray: 5 5

    class Dashboard,CLI consumer
    class runAnalysis,analyzeDeal,buildSummary core
    class ProductSource,MockSource,KeepaSource adapter
    class Product,DealResult,DealOutput model
    class MockData data
    class ProductSource interface
```

## Confini Architetturali

### 1. **Models Layer** (Foundation)
- **Nessuna dipendenza**: Solo type definitions TypeScript
- **Usato da**: Tutti i layer (Core, Adapters, Dashboard)
- **Confine**: Contratti immutabili condivisi

### 2. **Core Layer** (Business Logic)
- **Dipende solo da**: Models
- **Nessuna dipendenza da**: Adapters, Dashboard, Framework
- **Confine**: Logica pura, testabile in isolamento
- **Espone**: Funzioni pubbliche (`analyzeDeal`, `runDealAnalysis`)

### 3. **Adapter Layer** (Data Access)
- **Dipende solo da**: Models (ProductSource interface)
- **Nessuna dipendenza da**: Core, Dashboard
- **Confine**: Pattern Strategy, intercambiabile
- **Implementa**: `ProductSource.getProducts(): Promise<Product[]>`

### 4. **Consumer Layer** (UI/CLI)
- **Dipende da**: Core, Adapters, Models
- **Confine**: Solo visualizzazione/orchestrazione
- **Nessuna logica di business**: Delega tutto al Core

### 5. **Data Layer** (Static Data)
- **Nessuna dipendenza**: File JSON
- **Usato da**: MockProductSource
- **Confine**: Solo sviluppo/demo

## Regole di Dipendenza

```
Models ← Core ← Consumers
Models ← Adapters ← Consumers
Data ← Adapters
```

**Principio**: Le dipendenze vanno sempre verso il basso (verso Models), mai verso l'alto o orizzontali tra layer dello stesso livello.

## Flusso di Dati

1. **Consumer** istanzia un **Adapter** (es. MockProductSource)
2. **Adapter** restituisce `Product[]` (da Models)
3. **Consumer** chiama `runDealAnalysis(products)` dal **Core**
4. **Core** applica `analyzeDeal()` a ogni prodotto
5. **Core** formatta con `buildDecisionSummary()`
6. **Core** restituisce `DealOutput[]` al **Consumer**
7. **Consumer** visualizza i risultati

## Diagramma delle Interfacce e Contratti

```mermaid
classDiagram
    class ProductSource {
        <<interface>>
        +getProducts() Promise~Product[]~
    }
    
    class MockProductSource {
        +getProducts() Promise~Product[]~
    }
    
    class KeepaProductSource {
        +getProducts() Promise~Product[]~
    }
    
    class Product {
        +id: string
        +title: string
        +category: string
        +currentPrice: number
        +priceHistory: PricePoint[]
        +soldByAmazon: boolean
    }
    
    class DealAnalysisResult {
        +isValidDeal: boolean
        +discountPercentage: number
        +reason: string
        +flags: Flags
    }
    
    class DealOutput {
        +productId: string
        +title: string
        +currentPrice: number
        +isValidDeal: boolean
        +discountPercentage: number
        +summary: string
    }
    
    class analyzeDeal {
        +analyzeDeal(Product) DealAnalysisResult
    }
    
    class runDealAnalysis {
        +runDealAnalysis(Product[]) DealOutput[]
    }
    
    class buildDecisionSummary {
        +buildDecisionSummary(DealAnalysisResult) string
    }
    
    ProductSource <|.. MockProductSource : implements
    ProductSource <|.. KeepaProductSource : implements
    MockProductSource --> Product : returns
    KeepaProductSource --> Product : returns
    analyzeDeal --> Product : uses
    analyzeDeal --> DealAnalysisResult : returns
    runDealAnalysis --> analyzeDeal : uses
    runDealAnalysis --> buildDecisionSummary : uses
    runDealAnalysis --> DealOutput : returns
    buildDecisionSummary --> DealAnalysisResult : uses
```

## Diagramma di Sequenza (Flusso Esecutivo)

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant MockSource as MockProductSource
    participant Core as runDealAnalysis
    participant Analyze as analyzeDeal
    participant Summary as buildDecisionSummary
    
    User->>Dashboard: Carica pagina
    Dashboard->>MockSource: new MockProductSource()
    Dashboard->>MockSource: getProducts()
    MockSource-->>Dashboard: Product[]
    
    Dashboard->>Core: runDealAnalysis(products)
    
    loop Per ogni prodotto
        Core->>Analyze: analyzeDeal(product)
        Analyze->>Analyze: Calcola metriche (90d, 14d)
        Analyze->>Analyze: Rileva fake deals
        Analyze->>Analyze: Valida deal
        Analyze-->>Core: DealAnalysisResult
    end
    
    loop Per ogni risultato
        Core->>Summary: buildDecisionSummary(result)
        Summary-->>Core: string (summary)
    end
    
    Core-->>Dashboard: DealOutput[]
    Dashboard->>Dashboard: Ordina per isValidDeal
    Dashboard-->>User: Visualizza risultati
```

## Violazioni dei Confini (Da Evitare)

❌ Core → Adapters (Core non deve conoscere implementazioni specifiche)
❌ Core → Dashboard (Core non deve dipendere da UI)
❌ Adapters → Core (Adapters non devono contenere logica di business)
❌ Models → Altri layer (Models sono solo tipi, nessuna logica)

