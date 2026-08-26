from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.core.database import supabase
from app.schemas.watchlist import WatchlistCreate

router = APIRouter()


@router.get("/watchlist")
async def get_watchlist(user=Depends(get_current_user)):
    response = supabase.table("watchlist").select("*").eq("user_id", user.id).execute()
    return response.data


@router.post("/watchlist")
async def add_to_watchlist(item: WatchlistCreate, user=Depends(get_current_user)):
    response = supabase.table("watchlist").upsert(
        {
            "user_id": user.id,
            "symbol": item.symbol.upper(),
            "asset_type": item.asset_type,
        },
        on_conflict="user_id,symbol",
    ).execute()
    return response.data


@router.delete("/watchlist/{symbol}")
async def remove_from_watchlist(symbol: str, user=Depends(get_current_user)):
    response = (
        supabase.table("watchlist")
        .delete()
        .eq("user_id", user.id)
        .eq("symbol", symbol.upper())
        .execute()
    )
    return {"deleted": bool(response.data)}
