# Contributing to Pix3lPrompt

Thank you for your interest in contributing to Pix3lPrompt! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive in all interactions
- Provide constructive feedback
- Focus on the project goals and quality

## Reporting Bugs

1. Check [existing issues](https://github.com/pix3ltools/pix3lprompt/issues) to avoid duplicates
2. Open a new issue with:
   - A clear title and description
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Browser and OS information

## Suggesting Features

Open an issue with the **enhancement** label. Describe the feature, the use case, and how it fits with the existing editor workflow.

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feat/your-feature`
3. **Make your changes** and test locally
4. **Commit** using conventional commits (see below)
5. **Push** and open a Pull Request against `main`
6. Fill in the PR description with what changed and why

## Development Setup

### Prerequisites

- Node.js 18+
- Git

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/pix3lprompt.git
cd pix3lprompt
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Ensure the build passes with no errors before submitting a PR.

## Code Style

### General

- **TypeScript** strict mode — no `any` unless absolutely necessary
- **Functional components** with hooks
- Keep files focused — one component per file
- Prefer editing existing files over creating new ones

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | `EditorPanel.tsx` |
| Hooks | camelCase with `use` prefix | `useHistory.ts` |
| Utilities | camelCase | `utils.ts` |
| Constants | UPPER_CASE | `MAX_TOKENS` |
| CSS | Tailwind utility classes | `className="flex gap-2"` |

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add batch export for saved prompts
fix: correct AR format for Midjourney v7
docs: update README with new model list
style: align action bar buttons on mobile
refactor: extract prompt assembly into hook
chore: update dependencies
```

## Architecture Overview

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Routing, SSR shell |
| State | Zustand | Global editor state |
| Storage | Dexie.js (IndexedDB) | Persistent prompt history, settings |
| Styling | Tailwind CSS 4 + shadcn/ui | UI components and theming |
| AI | Provider interface | Pluggable AI backends with local fallback |

### Key Files

| File | Purpose |
|---|---|
| `lib/store.ts` | Zustand store with all editor state and actions |
| `lib/db.ts` | Dexie database schema (prompts, preferences, aiConfig) |
| `data/models.ts` | Model configs: suffix, AR format, negative format per model |
| `data/mock.ts` | Style chips, lighting presets, templates |
| `hooks/useHistory.ts` | CRUD operations for saved prompts |
| `hooks/useAiProvider.ts` | AI provider selection and fallback logic |
| `components/editor/EditorPanel.tsx` | Main editor with all sections and action bar |

## Testing Checklist

Before submitting a PR, verify:

- [ ] All models produce correct prompt syntax (Midjourney flags, Flux natural language, etc.)
- [ ] Style and lighting chips toggle correctly
- [ ] Save / load / delete prompts works
- [ ] Copy to clipboard works
- [ ] Optimize and Variations work (with local rules, no API key needed)
- [ ] Templates load into editor correctly
- [ ] Responsive layout: desktop 3-column and mobile tabs
- [ ] Dark and light themes render correctly
- [ ] `npm run build` passes with no errors
- [ ] No hydration warnings in the console

## Questions?

Reach out via [@pix3ltools](https://x.com/pix3ltools) on X or open a discussion on GitHub.
