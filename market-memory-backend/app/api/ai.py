from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_current_user
from app.services.ai_assistant import reflect_on_memories

router = APIRouter()


@router.get("/ai/reflect")
async def reflect(query: str, user=Depends(get_current_user)):
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query is required")
    insight = reflect_on_memories(user.id, query.strip())
    return {"insight": insight}
