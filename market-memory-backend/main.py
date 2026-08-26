from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api import ai, alerts, analytics, journal, theses, visits, watchlist
from app.core.config import settings
from app.core.database import supabase
from app.services.coingecko import get_live_price

app = FastAPI(title="Market Memory API", version="2.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/api/search")
def search_assets(q: str):
    query = q.strip()
    if len(query) < 2:
        return []

    try:
        response = (
            supabase.table("assets")
            .select("symbol,name,asset_type,backend_id")
            .or_(f"symbol.ilike.%{query}%,name.ilike.%{query}%")
            .limit(20)
            .execute()
        )
        return response.data
    except Exception as exc:
        print(f"Database search error: {exc}")
        raise HTTPException(status_code=500, detail="Error querying assets") from exc


@app.get("/api/price")
def fetch_live_market_tick(symbol: str, asset_type: str, backend_id: str):
    if asset_type != "crypto":
        raise HTTPException(
            status_code=400,
            detail="Live price provider currently supports crypto assets only",
        )

    price = get_live_price(backend_id)
    if price is not None:
        return {"symbol": symbol, "price": price}
    raise HTTPException(status_code=404, detail="Price not found")


app.include_router(analytics.router, prefix="/api", tags=["analytics"])
app.include_router(watchlist.router, prefix="/api", tags=["watchlist"])
app.include_router(alerts.router, prefix="/api", tags=["alerts"])
app.include_router(journal.router, prefix="/api", tags=["journal"])
app.include_router(theses.router, prefix="/api", tags=["theses"])
app.include_router(visits.router, prefix="/api", tags=["visits"])
app.include_router(ai.router, prefix="/api", tags=["ai"])


@app.get("/")
def health():
    return {"status": "running", "version": app.version}
