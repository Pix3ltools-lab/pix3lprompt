# Pix3lPrompt – Prompt di Generazione Completo

Genera un'applicazione **Next.js 15 (App Router)** con **TypeScript** chiamata **Pix3lPrompt**: un editor intelligente e iterativo di prompt per generatori AI di immagini, video e audio (Midjourney, Flux, Stable Diffusion, Leonardo, Suno, Kling, Runway, ecc.).

L'app deve essere **100% client-side**, **privacy-first**, funzionare **offline dopo il primo caricamento** (PWA) e avere **dark mode di default**.

> **Lingua**: Tutta l'interfaccia utente (label, placeholder, tooltip, toast, messaggi di errore) deve essere in **inglese**. I commenti al codice e i messaggi di commit nel repository Git devono essere in **inglese**.

---

## 1. Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router, `app/` directory) |
| Linguaggio | TypeScript strict |
| Styling | Tailwind CSS 4 + shadcn/ui |
| State management | Zustand (con persist middleware per sync con IndexedDB) |
| Storage locale | IndexedDB via Dexie.js |
| Icone | Lucide React |
| PWA | next-pwa o @serwist/next per service worker e offline support |
| LLM (opzionale) | Integrazione client-side con provider AI esterni (vedi sezione 8) |

**Target bundle**: < 2MB gzipped.

---

## 2. Struttura Progetto

```
pix3lprompt/
├── app/
│   ├── layout.tsx              # Root layout, ThemeProvider, font setup
│   ├── page.tsx                # Home: redirect o render main editor
│   ├── editor/
│   │   └── page.tsx            # Editor principale (3 colonne / tab mobile)
│   ├── compare/
│   │   └── page.tsx            # A/B Testing side-by-side
│   └── settings/
│       └── page.tsx            # Configurazione API keys e preferenze
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Shell con navigazione
│   │   ├── MobileNav.tsx       # Bottom tab bar per mobile
│   │   └── ThemeProvider.tsx   # Dark/light mode provider
│   ├── editor/
│   │   ├── PromptBuilder.tsx   # Editor principale con tutte le sezioni
│   │   ├── SubjectField.tsx    # Campo Subject con autocomplete
│   │   ├── StyleChips.tsx      # Chips selezionabili per stili
│   │   ├── LightingChips.tsx   # Chips per lighting & mood
│   │   ├── CompositionPicker.tsx # Aspect ratio + angoli camera
│   │   ├── DetailsField.tsx    # Campo testo libero per dettagli
│   │   ├── NegativePrompt.tsx  # Campo negative prompt con suggerimenti
│   │   ├── ParametersPanel.tsx # Slider/input per parametri AI (--v, --stylize, ecc.)
│   │   ├── ModelSelector.tsx   # Selettore modello AI target
│   │   ├── PromptPreview.tsx   # Live preview con syntax highlighting
│   │   └── ActionBar.tsx       # Bottoni: Copy, Optimize, Variations, Send to Board
│   ├── history/
│   │   ├── HistoryPanel.tsx    # Sidebar sinistra: lista prompt salvati
│   │   ├── HistoryCard.tsx     # Card singola con preview, rating, tag
│   │   ├── HistoryFilters.tsx  # Filtri: rating, data, modello, ricerca full-text
│   │   └── RatingStars.tsx     # Componente stelle 1-5
│   ├── templates/
│   │   ├── TemplatesPanel.tsx  # Sidebar destra: template e ispirazioni
│   │   ├── TemplateCard.tsx    # Card template con preview e "Use" button
│   │   └── FavoritesSection.tsx # Prompt con rating >= 4
│   ├── compare/
│   │   ├── CompareView.tsx     # Vista A/B side-by-side
│   │   └── CompareCard.tsx     # Singolo prompt in comparazione
│   ├── preview/
│   │   └── MoodPreview.tsx     # Mockup visivo CSS/SVG basato su keyword
│   ├── ai/
│   │   ├── AiProviderStatus.tsx # Indicatore stato connessione AI
│   │   └── AiSettingsForm.tsx  # Form configurazione provider AI
│   └── shared/
│       ├── ChipSelector.tsx    # Componente chip riusabile con selezione multipla
│       ├── WeightSlider.tsx    # Slider per pesi (::1.2)
│       ├── CopyButton.tsx      # Bottone copia con feedback visivo
│       └── ExportImport.tsx    # UI per export/import JSON
├── lib/
│   ├── db.ts                   # Setup Dexie.js, schema tabelle IndexedDB
│   ├── store.ts                # Zustand store principale
│   ├── ai/
│   │   ├── provider.ts         # Interfaccia astratta AI provider
│   │   ├── openrouter.ts       # Client OpenRouter
│   │   ├── openai.ts           # Client OpenAI diretto
│   │   ├── anthropic.ts        # Client Anthropic diretto
│   │   └── local-rules.ts      # Fallback: ottimizzazione basata su regole (no LLM)
│   ├── prompt/
│   │   ├── assembler.ts        # Assembla il prompt finale dalle sezioni
│   │   ├── optimizer.ts        # Logica di ottimizzazione (regole + AI)
│   │   ├── variations.ts       # Generatore di varianti (regole + AI)
│   │   └── syntax.ts           # Syntax highlighting per il preview
│   ├── templates/
│   │   └── presets.ts          # Template predefiniti per categoria
│   ├── analytics/
│   │   └── feedback-loop.ts    # Analisi locale dei pattern dai rating
│   └── export.ts               # Logica export/import JSON
├── hooks/
│   ├── usePromptBuilder.ts     # Hook gestione stato editor
│   ├── useHistory.ts           # Hook CRUD history IndexedDB
│   ├── useAiProvider.ts        # Hook per chiamate AI con loading/error
│   ├── useKeyboardShortcuts.ts # Hook shortcut tastiera
│   └── useDebounce.ts          # Utility debounce
├── types/
│   └── index.ts                # Tipi TypeScript condivisi
└── data/
    ├── styles.json             # Lista stili con label e keyword
    ├── lighting.json           # Lista lighting/mood presets
    ├── cameras.json            # Lista angoli camera
    ├── negative-prompts.json   # Suggerimenti negative prompt comuni
    └── model-params.json       # Parametri supportati per ogni modello AI
```

---

## 3. Database Locale (Dexie.js / IndexedDB)

### Schema

```typescript
// lib/db.ts
import Dexie, { type Table } from 'dexie';

export interface SavedPrompt {
  id?: number;
  subject: string;
  styles: string[];
  lighting: string[];
  composition: {
    aspectRatio: string;
    cameraAngle: string;
  };
  details: string;
  negativePrompt: string;
  parameters: Record<string, string | number>;
  targetModel: string;
  assembledPrompt: string;
  rating: number | null;         // 1-5 o null
  notes: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreference {
  id?: number;
  key: string;
  value: any;
}

export interface AiProviderConfig {
  id?: number;
  provider: 'openrouter' | 'openai' | 'anthropic' | 'none';
  apiKey: string;               // salvata solo in locale
  model: string;                // modello selezionato
  baseUrl?: string;             // per endpoint custom
}

class Pix3lPromptDB extends Dexie {
  prompts!: Table<SavedPrompt>;
  preferences!: Table<UserPreference>;
  aiConfig!: Table<AiProviderConfig>;

  constructor() {
    super('pix3lprompt');
    this.version(1).stores({
      prompts: '++id, rating, targetModel, createdAt, *tags, *styles',
      preferences: '++id, key',
      aiConfig: '++id, provider'
    });
  }
}

export const db = new Pix3lPromptDB();
```

---

## 4. Zustand Store

```typescript
// lib/store.ts
import { create } from 'zustand';

interface PromptBuilderState {
  // Campi editor
  subject: string;
  styles: string[];
  customStyle: string;
  styleWeight: number;
  lighting: string[];
  aspectRatio: string;
  cameraAngle: string;
  details: string;
  negativePrompt: string;
  parameters: Record<string, string | number>;
  targetModel: string;

  // UI state
  activePanel: 'history' | 'editor' | 'templates';
  isParametersPanelOpen: boolean;
  isOptimizing: boolean;
  isGeneratingVariations: boolean;

  // Actions
  setField: (field: string, value: any) => void;
  resetEditor: () => void;
  loadPrompt: (prompt: SavedPrompt) => void;
  setActivePanel: (panel: string) => void;
}
```

---

## 5. Layout e Responsive Design

### Desktop (>= 1280px): 3 colonne

```
┌──────────────┬───────────────────────────┬──────────────┐
│   History &   │      Prompt Builder       │  Templates & │
│   Gallery     │      (editor + preview    │  Inspirations│
│   (280px)     │       + actions)          │  (280px)     │
│               │                           │              │
│  - Lista      │  [Subject]                │  - Presets   │
│  - Filtri     │  [Style chips]            │  - Favorites │
│  - Search     │  [Lighting chips]         │  - Community │
│               │  [Composition]            │              │
│               │  [Details]                │              │
│               │  [Negative]               │              │
│               │  [Parameters]             │              │
│               │  ─────────────────        │              │
│               │  Live Preview             │              │
│               │  [Copy] [Optimize] [Vars] │              │
└──────────────┴───────────────────────────┴──────────────┘
```

### Mobile (< 768px): bottom tab navigation

```
┌─────────────────────────────┐
│         [Tab Content]       │
│                             │
│  Tab attivo: Editor /       │
│  History / Templates        │
│                             │
├─────────────────────────────┤
│  📋 History | ✏️ Editor | 💡 Templates │
└─────────────────────────────┘
```

- Il tab **Editor** su mobile mostra le sezioni come accordion collassabili.
- Il **PromptPreview** rimane sticky in fondo sopra la tab bar.

---

## 6. Componenti Editor - Dettagli

### SubjectField
- `<Textarea>` con placeholder contestuale basato su `targetModel`
- Autocomplete dropdown con keyword comuni (gestito con `cmdk` o lista custom)
- Debounce 300ms per aggiornare il preview

### StyleChips
- Grid di chip toggle (`Badge` di shadcn con variante selezionata)
- Stili predefiniti da `data/styles.json`: photorealistic, anime, cyberpunk, watercolor, cinematic, vaporwave, oil painting, pixel art, 3D render, concept art, sketch, surrealist, minimalist, retro, gothic, steampunk, art nouveau, pop art, impressionist, low poly
- Campo "Custom style" con `WeightSlider` (range 0.1 - 2.0, step 0.1)
- Selezione multipla: ogni chip selezionato contribuisce al prompt finale

### LightingChips
- Stessi meccanismi di StyleChips
- Presets: golden hour, neon glow, dramatic shadows, foggy, ethereal, rim light, studio lighting, natural light, backlit, moonlight, volumetric, harsh flash, candlelight, bioluminescent

### CompositionPicker
- Aspect ratio: griglia di bottoni con preview proporzionale (`16:9`, `3:2`, `1:1`, `9:16`, `4:5`, `21:9`)
- Camera angle: dropdown o chip (close-up, medium shot, wide shot, aerial/drone, low angle, high angle, dutch angle, POV, macro, fisheye)

### NegativePrompt
- `<Textarea>` con suggerimenti one-click da `data/negative-prompts.json`
- Suggerimenti comuni: blurry, deformed, watermark, extra limbs, bad anatomy, low quality, text, signature, cropped, out of frame, duplicate, ugly, mutilated

### ParametersPanel
- Collapsabile (`Collapsible` shadcn)
- Parametri dinamici in base a `targetModel` (caricati da `data/model-params.json`)
- Esempio per Midjourney: `--v` (slider 1-7), `--stylize` (0-1000), `--chaos` (0-100), `--weird` (0-3000), `--q` (0.25/0.5/1), `--tile` (toggle), `--style raw` (toggle)
- Esempio per Stable Diffusion: `steps` (1-150), `cfg_scale` (1-30), `sampler`, `seed`
- Ogni parametro ha tooltip con spiegazione

### ModelSelector
- `<Select>` con gruppi:
  - **Image**: Midjourney v7, Midjourney v6.1, Flux.1 Pro, Flux.1 Dev, SD 3.5, SDXL, Leonardo Phoenix, DALL-E 3, Ideogram 2
  - **Video**: Kling 2.0, Runway Gen-3, Pika 2.0, Luma Dream Machine
  - **Audio**: Suno v4, Udio
- Al cambio modello: aggiorna i parametri disponibili, placeholder del subject, suggerimenti e formato del prompt assemblato

### PromptPreview
- Rendering del prompt assemblato con colori per sezione:
  - **Subject**: `text-blue-400`
  - **Style**: `text-green-400`
  - **Lighting**: `text-yellow-400`
  - **Composition**: `text-purple-400`
  - **Details**: `text-slate-300`
  - **Parameters**: `text-orange-400`
  - **Negative**: `text-red-400/60`
- Conteggio caratteri e token (stima)
- Indicatore compatibilita modello (warning se prompt troppo lungo)

### ActionBar
- **Copy Prompt**: copia il testo assemblato, feedback toast "Copied!"
- **Save**: salva in IndexedDB, feedback toast
- **Optimize**: chiama il sistema di ottimizzazione (regole o AI)
- **Generate Variations**: genera 4-8 varianti
- **Send to Board**: placeholder per integrazione futura pix3lboard (export JSON)

---

## 7. Mockup Visivo CSS/SVG (MoodPreview)

Genera un preview visivo **senza generazione AI reale**, basato sulle keyword del prompt:

```typescript
// Logica di mapping keyword → stile visivo
const moodMap: Record<string, MoodStyle> = {
  cyberpunk: { gradient: ['#0ff', '#f0f', '#000'], overlay: 'scanlines', shape: 'grid' },
  golden_hour: { gradient: ['#ff8c00', '#ff6347', '#2d1b00'], overlay: 'lens-flare', shape: 'circle' },
  neon: { gradient: ['#ff00ff', '#00ffff', '#000'], overlay: 'glow', shape: 'lines' },
  watercolor: { gradient: ['#a8d8ea', '#aa96da', '#fcbad3'], overlay: 'paper-texture', shape: 'blob' },
  cinematic: { gradient: ['#1a1a2e', '#16213e', '#0f3460'], overlay: 'letterbox', shape: 'rectangle' },
  anime: { gradient: ['#ff6b9d', '#c44dff', '#6c5ce7'], overlay: 'speed-lines', shape: 'star' },
  // ... altri mapping
};
```

- Rendering in un `<div>` con CSS gradient, filtri SVG, forme astratte sovrapposte
- Dimensione: aspect ratio selezionato dall'utente
- Aggiornamento live al cambio di keyword (debounced)
- Testo sovrapposto semi-trasparente con le keyword principali

---

## 8. Integrazione LLM Esterno (AI Provider System)

### Architettura

L'app funziona **sempre senza AI** con un sistema a regole (`local-rules.ts`). Se l'utente configura un provider AI, le funzioni Optimize e Variations diventano potenziate.

```typescript
// lib/ai/provider.ts
export interface AiProvider {
  name: string;
  optimize(prompt: string, context: PromptContext): Promise<string>;
  generateVariations(prompt: string, count: number, context: PromptContext): Promise<string[]>;
  suggestImprovements(prompt: string, rating: number, notes: string): Promise<Suggestion[]>;
}

export interface PromptContext {
  targetModel: string;
  previousRatings: { prompt: string; rating: number; notes: string }[];
  preferredStyles: string[];
  avoidKeywords: string[];
}

export type ProviderType = 'openrouter' | 'openai' | 'anthropic' | 'local';
```

### OpenRouter (provider principale consigliato)

```typescript
// lib/ai/openrouter.ts
export class OpenRouterProvider implements AiProvider {
  name = 'OpenRouter';
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async callApi(messages: Message[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Pix3lPrompt'
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async optimize(prompt: string, context: PromptContext): Promise<string> {
    const systemPrompt = `You are an expert AI prompt engineer. Optimize the following prompt for ${context.targetModel}. Rules:
- Reorder keywords by importance (most important first)
- Remove redundant terms
- Add appropriate weights where beneficial
- Suggest negative prompts if missing
- Keep the user's creative intent intact
- Return ONLY the optimized prompt text, no explanations.`;

    return this.callApi([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Optimize this prompt:\n\n${prompt}` }
    ]);
  }

  async generateVariations(prompt: string, count: number, context: PromptContext): Promise<string[]> {
    const systemPrompt = `You are an expert AI prompt engineer. Generate exactly ${count} variations of the given prompt for ${context.targetModel}. Each variation should explore a different direction:
1. More detailed version
2. Different style/mood
3. Simplified/minimal version
4. Creative reinterpretation
${count > 4 ? '5-8. Additional creative explorations' : ''}
Return each variation on a new line, separated by "---". No explanations, just the prompts.`;

    const response = await this.callApi([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate ${count} variations of:\n\n${prompt}` }
    ]);
    return response.split('---').map(v => v.trim()).filter(Boolean);
  }

  async suggestImprovements(prompt: string, rating: number, notes: string): Promise<Suggestion[]> {
    const systemPrompt = `You are an expert AI prompt engineer. Based on the user's rating and notes about a prompt result, suggest specific improvements. Return as JSON array: [{"type": "add"|"remove"|"modify", "target": "keyword or section", "suggestion": "what to change", "reason": "why"}]`;

    const response = await this.callApi([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Prompt: ${prompt}\nRating: ${rating}/5\nNotes: ${notes}\n\nSuggest improvements.` }
    ]);
    return JSON.parse(response);
  }
}
```

### OpenAI Diretto

```typescript
// lib/ai/openai.ts
export class OpenAIProvider implements AiProvider {
  name = 'OpenAI';
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.model = model;
  }

  // Stessa interfaccia di OpenRouterProvider, ma header diversi:
  // 'Authorization': `Bearer ${this.apiKey}`
  // Nessun HTTP-Referer o X-Title necessario
}
```

### Anthropic Diretto

```typescript
// lib/ai/anthropic.ts
export class AnthropicProvider implements AiProvider {
  name = 'Anthropic';
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor(apiKey: string, model: string = 'claude-sonnet-4-5-20250929') {
    this.apiKey = apiKey;
    this.model = model;
  }

  // Usa /messages endpoint con:
  // 'x-api-key': this.apiKey
  // 'anthropic-version': '2023-06-01'
  // 'anthropic-dangerous-direct-browser-access': 'true'
  // Body format diverso: { model, max_tokens, system, messages }
}
```

### Fallback Locale (nessuna API)

```typescript
// lib/ai/local-rules.ts
export class LocalRulesProvider implements AiProvider {
  name = 'Local Rules';

  async optimize(prompt: string, context: PromptContext): Promise<string> {
    // 1. Rimuovi spazi e virgole doppie
    // 2. Riordina: subject → style → lighting → details → params
    // 3. Rimuovi keyword duplicate
    // 4. Aggiungi peso ::1.2 alle prime 3 keyword
    // 5. Se manca negative prompt, suggerisci i default per il modello
    return optimizedPrompt;
  }

  async generateVariations(prompt: string, count: number): Promise<string[]> {
    // Strategie template-based:
    // Var 1: aggiungi "highly detailed, 8k, sharp focus"
    // Var 2: cambia stile (se cinematic → moody, se anime → manga)
    // Var 3: aggiungi lighting diversa
    // Var 4: rimuovi modificatori (versione minimale)
    return variations;
  }

  async suggestImprovements(): Promise<Suggestion[]> {
    // Basato su pattern statistici dai prompt con rating alto nel DB locale
    return suggestions;
  }
}
```

### Factory e Hook

```typescript
// lib/ai/provider.ts
export function createProvider(config: AiProviderConfig): AiProvider {
  switch (config.provider) {
    case 'openrouter':
      return new OpenRouterProvider(config.apiKey, config.model);
    case 'openai':
      return new OpenAIProvider(config.apiKey, config.model);
    case 'anthropic':
      return new AnthropicProvider(config.apiKey, config.model);
    default:
      return new LocalRulesProvider();
  }
}

// hooks/useAiProvider.ts
export function useAiProvider() {
  const [config, setConfig] = useState<AiProviderConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.aiConfig.toCollection().first().then(setConfig);
  }, []);

  const provider = useMemo(() =>
    createProvider(config ?? { provider: 'none', apiKey: '', model: '' }),
    [config]
  );

  const optimize = async (prompt: string, context: PromptContext) => {
    setIsLoading(true);
    setError(null);
    try {
      return await provider.optimize(prompt, context);
    } catch (e) {
      setError(e.message);
      // Fallback automatico a regole locali
      return new LocalRulesProvider().optimize(prompt, context);
    } finally {
      setIsLoading(false);
    }
  };

  return { provider, config, isLoading, error, optimize, /* ... */ };
}
```

### Pagina Settings per AI Provider

```
┌─────────────────────────────────────────────────────────┐
│  AI Provider Settings                                    │
│                                                          │
│  Provider:  ○ None (regole locali)                      │
│             ● OpenRouter (consigliato - 300+ modelli)   │
│             ○ OpenAI diretto                             │
│             ○ Anthropic diretto                          │
│                                                          │
│  API Key:   [••••••••••••••••••••] 👁 [Test Connection] │
│                                                          │
│  Modello:   [▼ anthropic/claude-sonnet-4-5            ] │
│             Modelli suggeriti per prompt engineering:     │
│             - anthropic/claude-sonnet-4-5 (best value)   │
│             - google/gemini-2.0-flash (economico)        │
│             - openai/gpt-4o-mini (veloce)                │
│             - mistralai/mistral-large (alternativa EU)   │
│                                                          │
│  ⚠️ La API key viene salvata SOLO nel tuo browser       │
│     (IndexedDB locale). Non viene mai inviata a nessun  │
│     server tranne il provider AI selezionato.            │
│                                                          │
│  [Salva Configurazione]                                  │
└─────────────────────────────────────────────────────────┘
```

Se il provider selezionato e **OpenRouter**, mostra un selettore modello con fetch dinamico dalla API `/api/v1/models` di OpenRouter (oppure lista statica dei modelli consigliati come fallback).

---

## 9. Feedback Loop (Apprendimento Locale)

```typescript
// lib/analytics/feedback-loop.ts
export async function analyzeUserPatterns(): Promise<UserPatterns> {
  const prompts = await db.prompts.where('rating').aboveOrEqual(4).toArray();
  const lowRated = await db.prompts.where('rating').belowOrEqual(2).toArray();

  return {
    preferredStyles: extractTopKeywords(prompts, 'styles'),
    preferredLighting: extractTopKeywords(prompts, 'lighting'),
    avoidKeywords: extractFrequentKeywords(lowRated),
    avgParameters: computeAvgParameters(prompts),
    topModels: countByField(prompts, 'targetModel'),
    suggestedNegatives: extractFromLowRated(lowRated, 'negativePrompt')
  };
}
```

- Analisi eseguita localmente su IndexedDB
- I pattern vengono passati come `PromptContext` alle funzioni AI per risultati personalizzati
- Nella sidebar sinistra, badge "Based on your preferences" quando suggerimenti sono influenzati dalla history

---

## 10. A/B Testing (Compare View)

Rotta `/compare`:
- Split view: due editor affiancati (verticale su desktop, stack su mobile)
- Ogni lato carica un prompt (da history o dall'editor corrente)
- Rating e note indipendenti per lato
- Bottone "Choose Winner" che salva il vincente come favorito
- Differenze evidenziate tra i due prompt (diff testuale)

---

## 11. Keyboard Shortcuts

| Shortcut | Azione |
|---|---|
| `Ctrl/Cmd + Enter` | Copia prompt negli appunti |
| `Ctrl/Cmd + S` | Salva prompt corrente |
| `Ctrl/Cmd + O` | Apri Optimize |
| `Ctrl/Cmd + Shift + V` | Genera Varianti |
| `Ctrl/Cmd + K` | Ricerca rapida nella history |
| `Ctrl/Cmd + N` | Nuovo prompt (reset editor) |
| `Ctrl/Cmd + E` | Toggle pannello parametri |
| `1-5` (quando focus su rating) | Assegna stelle |

Implementare con un hook `useKeyboardShortcuts` globale. Mostrare cheat sheet con `?`.

---

## 12. Export/Import e Integrazione Pix3lboard

### Export JSON
```typescript
interface Pix3lPromptExport {
  version: '1.0';
  exportedAt: string;
  prompts: SavedPrompt[];
  preferences?: UserPreference[];
}
```

- Bottone "Export All" nella pagina Settings
- Bottone "Export Selected" nella history (checkbox multi-select)
- File `.pix3lprompt.json` scaricabile

### Import
- Drag & drop o file picker nella pagina Settings
- Validazione schema + merge intelligente (skip duplicati per hash del prompt)

### Send to Pix3lBoard (preparazione futura)

```typescript
interface BoardCardPayload {
  title: string;                 // auto-generato dal subject
  description: string;           // prompt completo
  prompt: string;                // prompt assemblato
  negativePrompt: string;
  parameters: Record<string, any>;
  targetModel: string;
  rating: number | null;
  notes: string;
  tags: string[];
  mockupDataUrl?: string;        // mockup visivo come base64
  variants?: string[];           // varianti generate
  source: 'pix3lprompt';
  sourceVersion: string;
}
```

- Per la v1 MVP: genera il JSON e lo copia negli appunti o lo scarica per import manuale in pix3lboard
- Per v2: chiamata API diretta a pix3lboard (se autenticato) con bottone "Send to Board"

---

## 13. PWA e Offline

- Configurare service worker con `@serwist/next`
- Cachare tutti gli asset statici e le pagine
- IndexedDB funziona nativamente offline
- Le chiamate AI falliscono gracefully con fallback a regole locali + toast "Offline: using local rules"
- Manifest con icone, theme color `#0a0a0a`, display `standalone`

---

## 14. Tema e Design System

- Dark mode di default (classe `dark` su `<html>`)
- Toggle light/dark nel header
- Palette dark:
  - Background: `#0a0a0a` (base), `#141414` (card), `#1e1e1e` (elevated)
  - Accent: `#7c3aed` (violet-600) per azioni primarie
  - Text: `#fafafa` (primary), `#a1a1aa` (secondary)
  - Syntax colors: come definito nella sezione PromptPreview
- Font: `Inter` per UI, `JetBrains Mono` per preview prompt
- Border radius: `8px` uniforme
- Animazioni: `framer-motion` solo per transizioni tab e toast, niente di pesante

---

## 15. Requisiti di Implementazione

1. ~~**Inizia dal layout responsive** (3 colonne desktop / tab mobile) con dati mock~~ ✅ **DONE**
   - Next.js 15 + Tailwind CSS 4 + shadcn/ui scaffolded
   - 3-column desktop layout (History 280px | Editor flex | Templates 280px)
   - Mobile bottom tab navigation with useState switching
   - CSS visibility toggle (`hidden xl:block` / `xl:hidden`) — no hydration mismatch
   - Dark mode default via next-themes + `@custom-variant dark`
   - Fonts: Inter (UI) + JetBrains Mono (preview)
   - Mock data: 5 prompts, 20 style chips, 14 lighting presets, 6 templates
2. ~~**Implementa l'editor** sezione per sezione~~ ✅ **DONE** (senza Zustand — useState locale, migrazione a Zustand prevista)
   - Subject, Details, Negative Prompt: `<textarea>` editabili
   - Style chips e Lighting chips: toggle multi-selezione
   - Composition: aspect ratio con selezione singola
   - Live Preview: assemblaggio in tempo reale con syntax highlighting per sezione (Subject=blue, Style=green, Lighting=yellow, Composition=purple, Details=slate, Negative=red)
   - Action Bar: Copy con feedback "Copied!", Optimize/Variations/Send to Board (placeholder)
   - Conteggio caratteri e stima token live
3. **Migra stato editor a Zustand store** e aggiungi ModelSelector
4. **Implementa IndexedDB** con Dexie per salvataggio e history
5. **Aggiungi il sistema AI provider** partendo da `LocalRulesProvider`, poi `OpenRouterProvider`
6. **Implementa Optimize e Variations** con fallback locale
7. **Aggiungi MoodPreview** CSS/SVG
8. **Implementa Compare view**
9. **Aggiungi PWA** con service worker
10. **Polish**: shortcuts, export/import, animazioni, accessibilita (a11y)

---

## 16. Evoluzione Futura: Integrazione con Pix3lBoard (Kanban)

### Analisi di Compatibilita

Pix3lPrompt e Pix3lBoard sono **naturalmente complementari**. Pix3lBoard (tabella Kanban con backend Turso) ha gia campi AI-oriented nella struttura `Card`:

```typescript
// Campi gia presenti in pix3lboard Card
{
  prompt?: string;           // campo prompt nella card
  rating?: 1 | 2 | 3 | 4 | 5; // rating identico a pix3lprompt
  aiTool?: string;           // modello AI usato
  type?: CardType;           // include 'image' | 'video' | 'audio' | 'music'
  tags?: string[];           // tag come in pix3lprompt
  thumbnail?: string;        // per l'immagine generata
}
```

### Differenze Architetturali

| Aspetto | Pix3lBoard | Pix3lPrompt |
|---------|-----------|-------------|
| **Storage** | Turso (SQLite cloud) + server | IndexedDB (client-only) |
| **Auth** | JWT + multi-user | Nessuna (single user) |
| **State** | React Context | Zustand |
| **Sync** | Delta sync server | Nessuna (locale) |
| **Next.js** | v14 | v15 |

### Strategie di Integrazione

#### A) PromptBuilder embedded in Pix3lBoard (Consigliata)

Integrare l'editor di prompt direttamente dentro `CardModal.tsx` di pix3lboard come tab "Prompt Editor" per card di tipo `image`/`video`/`audio`.

- Il PromptBuilder diventa un componente interno che scrive nei campi `prompt`, `aiTool`, `rating` della Card
- I dati strutturati (stili, lighting, parametri) vengono salvati nel campo `description` come JSON, il prompt assemblato nel campo `prompt`
- I file di dati (`styles.json`, `lighting.json`, ecc.) diventano risorse statiche condivise
- Il sistema AI provider si integra nella pagina Settings esistente di pix3lboard
- **Pro**: UX fluida, un solo deploy, dati unificati in Turso
- **Contro**: serve adattare lo state da Zustand a React Context, e lo storage da IndexedDB a Turso

#### B) Due app separate con "Send to Board" via API

Pix3lPrompt resta standalone. Un bottone "Send to Board" chiama `POST /api/lists/[listId]/cards` di pix3lboard.

- Serve autenticazione (token JWT) e selezione board/list target
- **Pro**: disaccoppiamento, ogni app resta indipendente
- **Contro**: due app da mantenere, UX frammentata, serve gestire auth cross-app

#### C) Pix3lPrompt come route dedicata in Pix3lBoard

Aggiungere `/workspace/[id]/board/[boardId]/prompt-editor` come nuova vista nell'app kanban.

- L'editor crea card direttamente nella board selezionata
- **Pro**: integrato nel flusso kanban, riutilizza auth e sync esistenti
- **Contro**: complessita intermedia

### Mapping Dati Pix3lPrompt → Card Pix3lBoard

```
SavedPrompt.subject         → Card.title
SavedPrompt.assembledPrompt → Card.prompt
SavedPrompt.targetModel     → Card.aiTool
SavedPrompt.rating          → Card.rating
SavedPrompt.tags            → Card.tags
SavedPrompt.notes           → Card.description
"image"/"video"/"audio"     → Card.type (derivato da targetModel)
MoodPreview (base64)        → Card.thumbnail
```

### Piano di Implementazione (Strategia A)

1. Creare un componente `PromptBuilder` riutilizzabile con chips stili/lighting/composizione
2. Integrarlo nel `CardModal.tsx` di pix3lboard come tab per card di tipo image/video/audio
3. Salvare i dati strutturati nel campo `description` (JSON) e il prompt assemblato in `prompt`
4. Aggiungere i file dati (`styles.json`, `lighting.json`, `cameras.json`, ecc.) come risorse statiche
5. Integrare il sistema AI provider nella pagina Settings di pix3lboard
6. Adattare lo state management da Zustand a React Context (DataContext di pix3lboard)
7. Sostituire IndexedDB con le API Turso per persistenza server-side
