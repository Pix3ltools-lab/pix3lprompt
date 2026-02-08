Genera un'applicazione Next.js 15 con TypeScript basata esattamente su questa descrizione:"
Pix3lPrompt – Descrizione Tecnica e Funzionale (per generazione codice)
Nome progetto: Pix3lPrompt
Tipo: Applicazione web open source
Stack tecnologico consigliato (2026):
Framework: Next.js 15 (App Router)
Linguaggio: TypeScript
Styling: Tailwind CSS + shadcn/ui (o Radix UI primitives)
State management: Zustand (leggero) o Jotai
Storage: IndexedDB (via idb-keyval o dexie.js) per salvare prompt, rating, history in locale
UI/UX: Mobile-first, dark mode di default, design minimal e veloce
Obiettivo: 100% client-side, zero backend obbligatorio, privacy-first
Descrizione generale
Pix3lPrompt è un editor intelligente e iterativo di prompt per generatori AI di immagini, video e audio (Midjourney, Flux, Stable Diffusion, Leonardo, Suno, Kling, Runway, ecc.).
Aiuta i creator a scrivere prompt migliori in modo strutturato, testare varianti rapidamente, imparare dai propri rating passati e integrarsi con gli altri tool Pix3l (pix3lboard, pix3lsense, pix3lforge).
Obiettivi principali dell’app
Ridurre il tempo di raffinamento prompt da ore a minuti
Creare un archivio personale intelligente dei prompt vincenti
Offrire suggerimenti contestuali e ottimizzazioni automatiche
Garantire funzionamento offline e privacy totale (nessun invio di prompt a server)
Struttura principale dell’interfaccia (layout desktop – responsive su mobile)
Tre colonne principali (su schermi larghi) / tab su mobile:
Sidebar sinistra – History & Gallery
Elenco cronologico dei prompt salvati
Ogni card mostra:
Anteprima testuale breve del prompt
Rating ★ (1–5) dato dall’utente
Numero di generazioni associate (se integrato con pix3lboard)
Tag / stile principale
Filtri: per rating, per data, per modello AI usato, ricerca full-text
Area centrale – Prompt Builder (editor principale)
Sezioni modulari (accordion o sezioni fisse):
Subject / Main Subject
Campo testo grande + suggerimenti autocomplete (basati su keyword comuni)
Style / Aesthetic
Chips selezionabili multipli (photorealistic, anime, cyberpunk, watercolor, cinematic, vaporwave, …)
campo custom + slider per peso (::1.2 / --style raw)
Lighting & Mood
Chips rapidi: golden hour, neon, dramatic shadows, foggy, ethereal, rim light, …
Composition & Camera
Picker aspect ratio (--ar 16:9, 3:2, 1:1, 9:16, …)
Angoli camera: close-up, wide shot, aerial, low angle, …
Details & Modifiers
Campo testo libero
Negative Prompt
Campo dedicato con suggerimenti comuni (--no blurry, deformed, watermark, extra limbs, …)
Parameters panel (toggleable)
Slider/input per: --v, --stylize, --chaos, --weird, --q, --tile, --s, --cref, --sref, ecc.
Selettore modello: Midjourney v7, Flux.1, SD 3.5, Leonardo Phoenix, …
Sotto l’editor:
Live preview del prompt completo (testo formattato con syntax highlighting: subject blu, style verde, params arancione, negative grigio)
Bottone “Copy Prompt” (copia negli appunti)
Bottone “Optimize” (riordina, rimuove ridondanze, suggerisce pesi)
Bottone “Generate 4 Variations” (crea varianti automatiche)
Sidebar destra – Templates & Inspirations
Templates predefiniti (categorizzati: portrait, landscape, product, thumbnail, concept art, …)
Sezione “My Favorites” (prompt salvati con rating ≥4)
Opzionale: sezione community anonima (template condivisi via hash, votabili)
Funzionalità core
Rating & Feedback Loop
Dopo uso esterno, l’utente può aprire un prompt dalla history e assegnare:
Stelle 1–5
Note testuali (“ottima pelle ma colori spenti”, “troppo cartoon”)
Il sistema impara localmente:
Preferenze di stile/lighting/parametri
Parole da evitare (in base a rating bassi)
Varianti automatiche
Genera 4–8 versioni modificate (es. +detail, change style, -chaos, more cinematic, …)
A/B Testing
Confronta 2 prompt fianco a fianco con rating e note
Ottimizzazione automatica
Riordina keyword (importanti davanti)
Aggiunge/rimuove pesi
Suggerisce negative prompt basati su history
Mockup visivo semplice (CSS/SVG)
Basato su keyword estratte → applica gradient, overlay neon, forme astratte per dare un “mood” visivo istantaneo (senza generazione reale)
Integrazione futura con Pix3l ecosystem
Esporta in pix3lboard (come card Kanban)
Importa reference da pix3lsense (estrazione keyword da immagini)
Requisiti non funzionali
Completamente offline dopo primo caricamento
Dark mode nativo
Shortcut da tastiera (Ctrl+Enter = copy, Ctrl+S = save, …)
Esportazione/importazione JSON dei prompt salvati
Bundle leggero (< 2MB gzipped ideale)
Roadmap MVP (minimo per prima release)
Editor modulare con live preview testuale formattato
Salvataggio in IndexedDB + history
Rating semplice + note
Bottone Optimize di base
Varianti automatiche (4 predefinite)
Mockup CSS visivo leggero basato su keyword
Copy prompt + syntax highlighting