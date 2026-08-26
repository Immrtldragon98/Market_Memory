# Market Memory — Foundation Fix Pass

## Fixed in this pass

- Removed hard-coded backend OpenAI and Supabase credentials from source.
- Added backend `.env.example` and frontend `.env.example`.
- Updated frontend Supabase client to read Expo public environment variables.
- Tightened frontend/backend `.gitignore` rules for environment files and archive leftovers.
- Added shared backend Bearer-token authentication dependency.
- Removed client-controlled `user_id` from protected journal, alerts, visits, analytics, watchlist, and AI APIs.
- Scoped alert update/delete operations to the authenticated user.
- Registered the previously disconnected AI router.
- Added watchlist add/remove API routes.
- Fixed missing imports in heartbeat and notification services.
- Added alert `above`/`below` trigger handling.
- Added guardrails for unavailable prices and zero initial prices in analytics.
- Corrected frontend `SearchResult` imports.
- Replaced unrestricted CORS with environment-configured origins.
- Added backend `requirements.txt`.
- Removed `.venv`, `.env`, `node_modules`, and nested `.rar` files from this clean package.

## Verification

- Python source passes `compileall` syntax verification.
- Frontend dependency installation could not complete inside the review sandbox before the command timeout, so a full TypeScript/Expo build still needs to be run locally.

## Before running

Backend: copy `market-memory-backend/.env.example` to `.env` and fill in your own values.

Frontend: copy `market-memory-frontend/.env.example` to `.env` and fill in the Supabase public values and API URL.

Do not commit either real `.env` file.

## Next architecture pass

The next major change should introduce the product core around:

`Thesis -> Assumptions -> Evidence -> Immutable Snapshot -> Review`

That should happen before adding more dashboard features or deeper AI behavior.
