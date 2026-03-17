# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A family chore scheduling app that renders to TRMNL e-ink displays (800x480px). Features a custom schedule DSL, daily Book of Mormon scripture rotation, and a daily "Word Sneak" vocabulary game. Deployed on Vercel with Vercel Postgres.

## Commands

- `npm run dev` — Start Next.js dev server (port 3000)
- `npm run build` — Production build
- `npm run lint` — Biome linter (`biome check`)
- `npm run format` — Biome formatter (`biome format --write`)
- `npm run generate:scriptures` — Regenerate scripture catalog from source JSON
- `npm run storybook` — Start Storybook (port 6006)
- `npm run build-storybook` — Build static Storybook

## Local Preview

Visit `/preview` on the dev server to see all 4 TRMNL layout variants rendered with the default schedule, today's Word Sneak words, and daily scripture. No database or auth required.

## Architecture

**Next.js 16 App Router** with `@/*` path alias mapping to `./src/*`.

### Schedule DSL

The core domain model is a text-based DSL parsed by `src/lib/schedule-parser.ts`:

```
@kids Ava, Ben, Chloe, Dylan
@mon
Ava: Make bed; Feed dog
Ben: Take out trash
*: Shared chore          ← global chore for all kids
@2026-01-10
Ava: Special chore       ← date overrides take priority over weekday
```

Date overrides (`@YYYY-MM-DD`) always win over weekday entries (`@mon`, `@tue`, etc.).

### Rendering Pipeline

`schedule text → parseScheduleText() → getChoresForDate() → markup-renderer.ts → 4 HTML layouts`

`markup-renderer.ts` generates four size variants for TRMNL displays: full (800x480), half-horizontal (800x240), half-vertical (400x480), and quadrant (400x240). All layouts are black/white, high-contrast HTML/CSS strings — not React components. Each layout includes:
- Date header and chore grid
- Word Sneak section (10 words from 10 categories, deterministic per date)
- Scripture footer with full verse text on full, half-horizontal, and half-vertical layouts
- Quadrant omits scripture to preserve legibility

### Daily Scripture

`src/lib/daily-scripture.ts` deterministically selects a Book of Mormon scripture for a `yyyy-MM-dd` date key from `src/data/book-of-mormon-scriptures.ts`. The scripture catalog is generated from `src/data/book-of-mormon-scriptures.source.json` via `npm run generate:scriptures` (runs `scripts/generate-book-of-mormon-scriptures.ts`). The generated manifest lives at `src/data/book-of-mormon-scriptures.manifest.ts`.

`text` is the canonical full scripture used by the renderer. `compactText` remains available for API/utility use but is not currently rendered in TRMNL markup. Also available standalone via `GET /api/daily-scripture?timezone=America/Denver&date=YYYY-MM-DD`.

`src/lib/scripture-catalog.ts` exports:
- `validateScriptureCatalog()` — catches duplicate references and empty entries
- `getScriptureCatalogSummary()` — emits a deterministic checksum and text-length distribution summary

### TRMNL Markup Diagnostics

`POST /api/trmnl/markup?diagnostics=1` returns the standard markup payload plus a `meta` object with timing, scripture, and layout diagnostics. The route also sets `x-chores-*` diagnostic headers on every response.

Structured error codes returned by `buildTrmnlMarkupError()`: `unauthorized`, `missing_user_uuid`, `invalid_scripture_catalog`, `instance_not_found`, `internal_error`.

### Renderer Helpers

`src/lib/markup-renderer.ts` also exports:
- `getMarkupMetrics()` — machine-readable HTML length metrics per layout variant
- `getScheduleSummary()` — machine-readable kid/chore counts for a day schedule

### Word Sneak

`src/data/words.ts` defines 10 vocabulary categories (archaic, nouns, silly, vocab, positive, action, emotions, foods, sounds, nature) with ~200+ words each. `getDailyWords()` in the markup renderer picks one word per category deterministically per date.

### Data Flow

- **API routes** (`src/app/api/`) handle all DB operations via `src/lib/db.ts` (Vercel Postgres)
- **TRMNL integration**: `POST /api/trmnl/markup` is the main endpoint — requires Bearer token auth, returns all 4 markup variants
- **Client pages**: `/manage` (schedule editor, needs `?uuid=` param) and `/ben` (quote editor) are `"use client"` components
- **Preview**: `/preview` renders all 4 layouts using default schedule data (no DB needed)

### Database

Four tables defined in `db/migrations/`: `install_sessions` (OAuth flow), `plugin_instances` (per-installation config + schedule text), `ben_quotes` (quote collection), `current_ben_quote` (single-row active quote).

### Environment Variables

Required: `TRMNL_CLIENT_ID`, `TRMNL_CLIENT_SECRET`, `POSTGRES_URL`
Optional: `ADMIN_PASSCODE` (protects schedule/quote updates)

## Code Style

- **Biome** for linting and formatting (2-space indent, organized imports)
- **Tailwind CSS v4** via PostCSS
- **Zod** for API request validation
- **Luxon** for timezone-aware date handling

## Design Context

### Users
A family of four kids (Ava, Ben, Chloe, Dylan) who check a TRMNL e-ink display each morning to see their chores, a daily scripture, and vocabulary words to sneak into conversation.

### Brand Personality
**Warm, playful, encouraging.** A family bulletin board with heart — not a task tracker. Word Sneak and daily scripture give it personality beyond a chore list.

### Aesthetic Direction
- **Reference:** Kindle/e-reader — clean typography, comfortable reading, content-first
- **Anti-references:** Cluttered bulletin boards (every element earns its space), boring plain text (needs visual structure)
- **Theme:** Black and white only (e-ink constraint), high-contrast, typography-driven

### Emotional Goal
**Curiosity and delight.** Kids should feel drawn to check the display — the scripture and Word Sneak make it interesting, not just obligatory.

### Design Principles
1. **Every element earns its space.** No decoration — but "delight" is a valid purpose.
2. **Typography is the design system.** Hierarchy comes from font size, weight, spacing, and case.
3. **Scannable first, readable second.** Design for the glance, reward the read.
4. **Warm structure, not cold grids.** Organized but approachable.
5. **Surprise within consistency.** Stable layout, rotating content.
