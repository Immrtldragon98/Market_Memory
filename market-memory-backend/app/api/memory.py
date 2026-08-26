from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user
from app.core.database import supabase
from app.schemas.memory import MarketSnapshotCreate, ObservationCreate

router = APIRouter()


def _normalize_symbol(symbol: str) -> str:
    return symbol.strip().upper()


@router.post("/observations", status_code=status.HTTP_201_CREATED)
async def create_observation(payload: ObservationCreate, user=Depends(get_current_user)):
    data = payload.model_dump()
    data["user_id"] = user.id
    data["symbol"] = _normalize_symbol(payload.symbol)
    data["observation"] = payload.observation.strip()
    try:
        rows = supabase.table("market_observations").insert(data).execute().data or []
        if not rows:
            raise HTTPException(status_code=400, detail="Unable to save observation")
        return rows[0]
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Unable to save observation") from exc


@router.get("/observations")
async def list_observations(symbol: str | None = None, user=Depends(get_current_user)):
    query = supabase.table("market_observations").select("*").eq("user_id", user.id)
    if symbol:
        query = query.eq("symbol", _normalize_symbol(symbol))
    return query.order("created_at", desc=True).limit(250).execute().data or []


@router.post("/snapshots", status_code=status.HTTP_201_CREATED)
async def create_market_snapshot(payload: MarketSnapshotCreate, user=Depends(get_current_user)):
    data = payload.model_dump()
    data["user_id"] = user.id
    data["symbol"] = _normalize_symbol(payload.symbol)
    if payload.note is not None:
        data["note"] = payload.note.strip()
    try:
        rows = supabase.table("market_snapshots").insert(data).execute().data or []
        if not rows:
            raise HTTPException(status_code=400, detail="Unable to capture snapshot")
        return rows[0]
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Unable to capture snapshot") from exc


@router.get("/snapshots")
async def list_market_snapshots(symbol: str | None = None, user=Depends(get_current_user)):
    query = supabase.table("market_snapshots").select("*").eq("user_id", user.id)
    if symbol:
        query = query.eq("symbol", _normalize_symbol(symbol))
    return query.order("created_at", desc=True).limit(250).execute().data or []
