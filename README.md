# Market Memory

**Digital memory for market research and trading decisions.**

Market Memory is a focused trading journal and market observation system for recording what you saw, what you thought, and what you decided around the market.

## Core product

1. **Trading journal** — record decisions, notes, confidence and mistakes.
2. **Market observations** — quickly save what you notice about an asset at a point in time.
3. **Watchlists** — keep the markets you care about close.
4. **Price alerts** — remember important levels without continuously watching the screen.
5. **Market snapshots** — freeze market context and your note so it can be revisited later.

## Product loop

**Observe → Record → Decide → Remember → Review**

The product deliberately starts small. Structured thesis analysis, AI reflection and deeper research can extend this memory later, but they are not the center of the core experience.

## Architecture

Mobile-first application using:

- React Native / Expo
- TypeScript
- FastAPI
- Supabase

## Engineering principles

- Memory should be fast to capture.
- Historical snapshots should be immutable.
- User-owned data must be isolated and authenticated.
- Focused workflows are preferred over feature-heavy interfaces.
- AI is optional enrichment, not a dependency for the core product.

## Repository layout

- `market-memory-backend/` — FastAPI API, services and database migrations
- `market-memory-frontend/` — Expo / React Native application

---

Current work: **v1 Core Memory Rebuild**
