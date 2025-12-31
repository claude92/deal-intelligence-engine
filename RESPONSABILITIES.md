# Responsabilità e Limiti delle Cartelle

## Diagramma delle Responsabilità

```mermaid
flowchart TB
    subgraph Models["`**📁 models/**<br/>Type Definitions`"]
        direction TB
        ModelsDO["`✅ **DEVE:**<br/>• Definire solo tipi TS<br/>• Essere condiviso da tutti<br/>• Rappresentare dominio<br/>• Essere immutabile`"]
        ModelsDONT["`❌ **NON DEVE:**<br/>• Logica di business<br/>• Funzioni o classi<br/>• Dipendere da altri layer<br/>• Valori default/factory`"]
    end

    subgraph Core["`**📁 core/**<br/>Business Logic`"]
        direction TB
        CoreDO["`✅ **DEVE:**<br/>• Logica pura (pure functions)<br/>• Essere testabile isolato<br/>• Accettare Product come input<br/>• Restituire DealAnalysisResult`"]
        CoreDONT["`❌ **NON DEVE:**<br/>• Importare da adapters/<br/>• Dipendere da framework<br/>• Fare chiamate HTTP/I/O<br/>• Gestire UI o rendering<br/>• Accedere file system`"]
    end

    subgraph Adapters["`**📁 adapters/**<br/>Data Sources`"]
        direction TB
        AdaptersDO["`✅ **DEVE:**<br/>• Implementare ProductSource<br/>• Normalizzare dati esterni<br/>• Gestire errori I/O<br/>• Essere intercambiabile`"]
        AdaptersDONT["`❌ **NON DEVE:**<br/>• Logica di business<br/>• Dipendere da core/<br/>• Gestire UI<br/>• Modificare modello Product`"]
    end

    subgraph Dashboard["`**📁 dashboard/**<br/>React UI Consumer`"]
        direction TB
        DashboardDO["`✅ **DEVE:**<br/>• Consumare runDealAnalysis<br/>• Usare ProductSource<br/>• Visualizzare risultati<br/>• Gestire loading/errori`"]
        DashboardDONT["`❌ **NON DEVE:**<br/>• Logica di analisi<br/>• Calcoli su prezzi<br/>• Modificare modelli<br/>• Accedere direttamente API`"]
    end

    subgraph Data["`**📁 data/**<br/>Mock Data`"]
        direction TB
        DataDO["`✅ **DEVE:**<br/>• Fornire dati realistici<br/>• Coprire edge cases<br/>• Essere JSON compatibile`"]
        DataDONT["`❌ **NON DEVE:**<br/>• Essere usato in produzione<br/>• Contenere dati sensibili<br/>• Essere modificato da runtime`"]
    end

    %% Dipendenze
    Core -.->|"dipende solo da"| Models
    Adapters -.->|"dipende solo da"| Models
    Dashboard -.->|"dipende da"| Core
    Dashboard -.->|"dipende da"| Adapters
    Dashboard -.->|"dipende da"| Models
    Adapters -.->|"legge da"| Data

    %% Stili
    classDef modelsStyle fill:#e8f5e9,stroke:#1b5e20,stroke-width:3px
    classDef coreStyle fill:#f3e5f5,stroke:#4a148c,stroke-width:3px
    classDef adapterStyle fill:#fff3e0,stroke:#e65100,stroke-width:3px
    classDef dashboardStyle fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    classDef dataStyle fill:#fce4ec,stroke:#880e4f,stroke-width:3px
    classDef doStyle fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    classDef dontStyle fill:#ffcdd2,stroke:#c62828,stroke-width:2px

    class Models,ModelsDO,ModelsDONT modelsStyle
    class Core,CoreDO,CoreDONT coreStyle
    class Adapters,AdaptersDO,AdaptersDONT adapterStyle
    class Dashboard,DashboardDO,DashboardDONT dashboardStyle
    class Data,DataDO,DataDONT dataStyle
    class ModelsDO,CoreDO,AdaptersDO,DashboardDO,DataDO doStyle
    class ModelsDONT,CoreDONT,AdaptersDONT,DashboardDONT,DataDONT dontStyle
```

## Matrice delle Responsabilità

```mermaid
graph LR
    subgraph "Cosa può fare ogni cartella"
        direction TB
        A[Cartella] --> B[models]
        A --> C[core]
        A --> D[adapters]
        A --> E[dashboard]
        A --> F[data]
        
        B --> B1["✅ Tipi TypeScript<br/>✅ Contratti condivisi<br/>✅ Modelli dominio"]
        C --> C1["✅ Logica business<br/>✅ Algoritmi analisi<br/>✅ Pure functions"]
        D --> D1["✅ Accesso dati<br/>✅ Normalizzazione<br/>✅ Pattern Strategy"]
        E --> E1["✅ Visualizzazione<br/>✅ Orchestrazione<br/>✅ UI React"]
        F --> F1["✅ Dati mock<br/>✅ Test data<br/>✅ JSON statici"]
    end
    
    subgraph "Cosa NON può fare"
        direction TB
        B --> B2["❌ Logica<br/>❌ Funzioni<br/>❌ Dipendenze"]
        C --> C2["❌ I/O esterno<br/>❌ Framework<br/>❌ Adapters"]
        D --> D2["❌ Business logic<br/>❌ Core<br/>❌ UI"]
        E --> E2["❌ Analisi<br/>❌ Calcoli<br/>❌ Modelli"]
        F --> F2["❌ Produzione<br/>❌ Dati reali<br/>❌ Runtime mod"]
    end
```

## Confini e Violazioni

```mermaid
flowchart TD
    subgraph "Regole di Dipendenza"
        Models[models] -->|"✅ OK: Tutti dipendono da Models"| All[Altri layer]
        Core[core] -->|"✅ OK: Dipende solo da Models"| Models
        Adapters[adapters] -->|"✅ OK: Dipende solo da Models"| Models
        Dashboard[dashboard] -->|"✅ OK: Dipende da Core, Adapters, Models"| Core
        Dashboard -->|"✅ OK"| Adapters
        Dashboard -->|"✅ OK"| Models
    end
    
    subgraph "Violazioni da Evitare"
        Core -.->|"❌ VIETATO"| Adapters2[adapters]
        Core -.->|"❌ VIETATO"| Dashboard2[dashboard]
        Adapters -.->|"❌ VIETATO"| Core2[core]
        Adapters -.->|"❌ VIETATO"| Dashboard3[dashboard]
        Models -.->|"❌ VIETATO"| Any[Qualsiasi altro layer]
    end
    
    style Models fill:#c8e6c9
    style Core fill:#e1bee7
    style Adapters fill:#ffe0b2
    style Dashboard fill:#b3e5fc
    style Adapters2 fill:#ffcdd2
    style Dashboard2 fill:#ffcdd2
    style Core2 fill:#ffcdd2
    style Dashboard3 fill:#ffcdd2
    style Any fill:#ffcdd2
```

## Tabella Riassuntiva

| Cartella | Responsabilità Principale | Dipende da | Usato da | Limiti Critici |
|----------|---------------------------|------------|----------|----------------|
| **models/** | Definire tipi TypeScript | Nessuna | Tutti | ❌ Nessuna logica |
| **core/** | Logica di business | models | dashboard, CLI | ❌ No I/O, no framework |
| **adapters/** | Accesso dati | models | dashboard, CLI | ❌ No business logic |
| **dashboard/** | UI React | core, adapters, models | Utenti | ❌ No analisi, solo visualizzazione |
| **data/** | Dati mock | Nessuna | adapters | ❌ Solo sviluppo, no produzione |

## Principi Architetturali

1. **Separazione delle Responsabilità**: Ogni cartella ha un unico scopo chiaro
2. **Dipendenze Unidirezionali**: Sempre verso il basso (verso models)
3. **Indipendenza del Core**: Il core non conosce implementazioni specifiche
4. **Intercambiabilità**: Gli adapter possono essere sostituiti senza modificare il core
5. **Testabilità**: Ogni layer può essere testato in isolamento

