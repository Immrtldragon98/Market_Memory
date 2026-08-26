# Market Memory v0.2 — Thesis Foundation

## What changed

This release changes the product model from a loose journal/watchlist app toward the Market Memory core:

**Asset -> Thesis -> Assumptions -> Evidence -> Immutable Snapshot -> Future Review**

### Backend
- Added protected `/api/theses` API.
- Added thesis create/list/read/update operations.
- Added assumption create/update operations.
- Added evidence creation with ownership validation.
- Added immutable thesis snapshot creation/listing.
- Registered the thesis router in FastAPI and bumped API version to 2.2.0.

### Database
Run `market-memory-backend/migrations/001_thesis_memory_foundation.sql` once in the Supabase SQL editor.

It creates:
- `theses`
- `thesis_assumptions`
- `thesis_evidence`
- `thesis_snapshots`

All four tables have RLS ownership policies. Snapshot rows are append-only: database triggers reject UPDATE and DELETE, including privileged API writes. This preserves the historical "what I knew then" state.

### Frontend
- Discovery now has a **Thesis** action.
- Thesis creation asks beginner-friendly questions:
  - What do you think will happen?
  - Why do you believe it?
  - What would prove you wrong?
  - What needs to be true?
  - Timeframe
  - Confidence
- Creating a thesis automatically captures the initial immutable snapshot, including current asset/price context.
- Added a **Theses** tab to reopen saved reasoning and assumptions.
- Added authenticated `ThesisService` calls using the active Supabase access token.

## Cleanup included
- Fixed `asset.type` -> `asset.asset_type` contract mismatch.
- Repaired missing/incorrect relative imports in Discovery components.
- Fixed the watchlist component's reference to a nonexistent `Asset` contract.
- Fixed authentication service naming (`signIn` / `signUp`).
- Replaced the incorrect auth `_layout.tsx` login implementation with a real Expo Router `Stack` layout.
- Fixed missing theme keys used by tab/journal screens.
- Fixed the obsolete alert payload shape in Discovery.
- Removed unused prototype components that referenced deleted domain models/providers.

## Verification
- Python/FastAPI source compiles successfully with `python -m compileall`.
- All local relative TypeScript imports resolve to existing files.
- Full Expo/TypeScript dependency verification could not finish in this sandbox because `npm ci` exceeded the execution window; run the commands below locally.

## First local run

### 1. Database
Open Supabase -> SQL Editor and run:

`market-memory-backend/migrations/001_thesis_memory_foundation.sql`

### 2. Backend
Create `.env` from `.env.example`, then:

```bash
cd market-memory-backend
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend
Create `.env` from `.env.example`, then:

```bash
cd market-memory-frontend
npm ci
npx tsc --noEmit
npx expo start
```

## Next product milestone

The next logical V0 step is **Thesis Review**:
1. attach supporting/contradicting evidence to assumptions,
2. change each assumption to strengthening/stable/weakening/broken,
3. compare the current thesis against the immutable original snapshot,
4. let AI challenge changes in reasoning without issuing BUY/HOLD/SELL recommendations.
