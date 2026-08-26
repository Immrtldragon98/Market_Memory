from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_current_user
from app.services.analytics import get_passive_performance

router = APIRouter()


@router.get("/analytics/passive/{symbol}")
async def passive_performance(symbol: str, user=Depends(get_current_user)):
    data = get_passive_performance(user.id, symbol)
    if not data:
        raise HTTPException(status_code=404, detail="No history found for this symbol")
    return data
