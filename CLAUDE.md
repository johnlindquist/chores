# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A family chore scheduling app that renders to TRMNL e-ink displays (800x480px). Features a custom schedule DSL, Ben's Corner quotes, and a daily "Word Sneak" vocabulary game. Deployed on Vercel with Vercel Postgres.

## Commands

- `npm run dev` — Start Next.js dev server (port 3000)
- `npm run build` — Production build
- `npm run lint` — Biome linter (`biome check`)
- `npm run format` — Biome formatter (`biome format --write`)
- `npm run storybook` — Start Storybook (port 6006)
- `npm run build-storybook` — Build static Storybook

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

`markup-renderer.ts` generates four size variants for TRMNL displays: full (800x480), half-horizontal (800x240), half-vertical (400x480), and quadrant (400x240). All layouts are black/white, high-contrast HTML/CSS strings — not React components.

### Data Flow

- **API routes** (`src/app/api/`) handle all DB operations via `src/lib/db.ts` (Vercel Postgres)
- **TRMNL integration**: `POST /api/trmnl/markup` is the main endpoint — requires Bearer token auth, returns all 4 markup variants
- **Client pages**: `/manage` (schedule editor, needs `?uuid=` param) and `/ben` (quote editor) are `"use client"` components
- **Storybook stories** in `src/stories/` showcase different visual designs for the ChoreDisplay component

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
