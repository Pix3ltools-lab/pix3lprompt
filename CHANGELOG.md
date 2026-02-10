# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.3.1] - 2026-02-10

### Added

- **LM Studio support** — New AI provider option for local models via LM Studio's OpenAI-compatible API; configurable server URL and model name, no API key required
- **Dedicated LM Studio settings UI** — Server URL field (default `http://localhost:1234/v1`), free-text model name input, connection test button, and local-specific privacy notice

## [1.3.0] - 2026-02-09

### Added

- **Progressive Web App (PWA)** — Pix3lPrompt is now installable as a standalone desktop/mobile app from Chrome and Edge with its own window, taskbar icon and offline caching
- **Web App Manifest** — `app/manifest.ts` with app identity, theme colors, start URL, display mode and screenshot previews
- **Service Worker** — Network-first caching strategy for offline resilience with automatic cache versioning
- **Custom app icon** — Pixel-art "P" icon in violet theme, generated in SVG, PNG 192x192, PNG 512x512 and Apple Touch Icon formats
- **Apple Web App support** — Meta tags and apple-touch-icon for iOS home screen installation
- **Icon generation scripts** — `scripts/generate-icons.mjs` and `scripts/generate-screenshots.mjs` for reproducible asset generation via sharp

## [1.2.0] - 2026-02-09

### Added

- **6 new chip sections** — Camera Angle (10 presets), Color Palette (10), Medium/Texture (10), Quality (8), Framing (9), Mood (10) — 57 new presets total with color-coded live preview
- **Gemini Flash Image and Gemini Pro Image models** — Google Gemini image generation with natural language prompts, no negative prompt, plain aspect ratio
- **Toast notifications** — Sonner toast component via shadcn/ui; "Send to Pix3lBoard" button now shows a coming-soon info toast
- **Reusable ChipSection component** — Extracted chip rendering into a shared component reducing editor code duplication

### Fixed

- **Camera Angle and Framing are now single-select** — Mutually exclusive options (e.g. Close-Up vs Wide Shot) no longer stack; clicking a new option replaces the previous one

### Changed

- **Camera angle migrated from text to chips** — `cameraAngle: string` replaced by `cameraAngles: string[]` with chip selector; Dexie DB upgraded to v2 with migration
- **All 20 templates enriched** — Existing templates updated with relevant Camera Angle, Color Palette, Medium, Quality, Framing and Mood chips
- **Preset type unified** — New `Preset` interface; `StyleChip` and `LightingPreset` are now type aliases
- **SavedPrompt expanded** — Added optional fields: `cameraAngles`, `colorPalette`, `medium`, `quality`, `framing`, `mood`

## [1.1.0] - 2026-02-09

### Added

- **14 new templates** — Anime Character, Architectural Viz, Food Photography, Retro Poster, Dark Gothic Scene, Isometric Game Asset, Sci-Fi Book Cover, Oil Portrait Master, Dreamy Double Exposure, Street Photography, Cinematic Drone Shot, Music Video Loop, Lo-Fi Beat, Epic Trailer Music
- **Template categories by media type** — Templates panel now organized into Image (16), Video (2), Audio (2) sections with icons and counts
- **Architecture skill** — `/architecture` slash command for Claude Code with full codebase reference

### Fixed

- **Duplicate model parameters in optimized prompts** — Optimize and Variations were passing the full assembled prompt (including `--ar`, `--v`, `--no`) to the AI provider, then placing the result back into the subject field causing `--ar` and `--v` to appear twice
- **Wrong Midjourney flags from LLM** — OpenRouter system prompt instructed the LLM to "suggest negative prompts", causing hallucinated flags like `--negatives` or `--neg` instead of `--no`
- **LLM flag injection safety net** — Added `stripModelFlags()` sanitizer that strips any `--flag` from AI provider responses as a fallback
- **Local rules injecting `--no`** — Removed negative prompt injection from LocalRulesProvider since that is the assembler's responsibility
- **Template badge crash** — Fixed crash on templates with no styles (audio templates)
- **Hidden templates** — Previously, 2 templates with "favorites" category were never rendered; now all templates are visible under proper media sections

### Changed

- **Optimizer receives content-only prompts** — AI providers now receive only keywords (subject, styles, lighting, details) without model-specific parameters; styles, lighting and details are cleared after optimization since they are merged into the result
- **Template category type** — Changed from `"quick-start" | "favorites"` to `"image" | "video" | "audio"`

## [1.0.0] - 2026-02-08

### Added

- **Responsive layout shell** — 3-column desktop layout (History | Editor | Templates) and tab-based mobile layout with bottom navigation
- **Interactive prompt editor** — Subject field, 20 style chips, 14 lighting presets, aspect ratio picker, camera angle, details and negative prompt fields
- **Live preview** — Color-coded syntax highlighting by segment (subject, style, lighting, AR, model suffix, negative)
- **Zustand state management** — Global editor store with all fields, UI state and actions
- **Model selector** — Support for Midjourney (v5.2–v7), Flux, Stable Diffusion, DALL-E, Leonardo, Kling, Runway, Suno, Udio
- **Model-aware prompt assembly** — Per-model suffix, aspect ratio format, negative prompt format and placeholder
- **IndexedDB persistence** — Save, load, update and delete prompts with Dexie.js; rating (1–5 stars), favorites, tags
- **AI provider system** — Pluggable provider interface with LocalRulesProvider (rule-based, no API key) and OpenRouterProvider (300+ models)
- **Optimize and Variations** — AI-powered prompt optimization and 4-variant generation with automatic fallback to local rules
- **Templates** — 6 quick-start templates with Use button; favorites section auto-populated from prompts rated >= 4 stars
- **Settings page** — AI provider configuration (OpenRouter, OpenAI, Anthropic) with API key storage, connection test, model selector
- **Header** — Pix3lTools branding with colored characters, version badge, dark/light theme toggle
- **Footer** — Pix3lTools collection link, X/Twitter follow link, Privacy Policy link
- **Privacy Policy page** — Comprehensive policy covering local storage, optional AI providers, no tracking, user control
- **Storage disclaimer** — Amber banner warning that data is saved locally only, dismissible for 7 days
- **Dark mode** — Dark theme by default with light mode toggle via next-themes
- **Copy to clipboard** — One-click copy with visual feedback

[1.3.1]: https://github.com/Pix3ltools-lab/pix3lprompt/releases/tag/v1.3.1
[1.3.0]: https://github.com/Pix3ltools-lab/pix3lprompt/releases/tag/v1.3.0
[1.2.0]: https://github.com/Pix3ltools-lab/pix3lprompt/releases/tag/v1.2.0
[1.1.0]: https://github.com/Pix3ltools-lab/pix3lprompt/releases/tag/v1.1.0
[1.0.0]: https://github.com/Pix3ltools-lab/pix3lprompt/releases/tag/v1.0.0
