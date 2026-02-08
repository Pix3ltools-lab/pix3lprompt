# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

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

[1.0.0]: https://github.com/Pix3ltools-lab/pix3lprompt/releases/tag/v1.0.0
