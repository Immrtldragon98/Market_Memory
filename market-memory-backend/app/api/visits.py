from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.core.auth import get_current_user
from app.core.database import supabase

router = APIRouter()


class VisitCreate(BaseModel):
    symbol: str
    visited_price: float = Field(gt=0)


@router.post("/visits")
async def track_visit(visit: VisitCreate, user=Depends(get_current_user)):
    response = supabase.table("visits").insert({
        "user_id": user.id,
        "symbol": visit.symbol.upper(),
        "visited_price": visit.visited_price,
    }).execute()
    return response.data
