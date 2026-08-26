from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_current_user
from app.core.database import supabase
from app.schemas.journal import JournalEntryCreate
from app.services.ai_assistant import get_embedding

router = APIRouter()


@router.post("/journal")
async def create_entry(entry: JournalEntryCreate, user=Depends(get_current_user)):
    try:
        vector = None
        try:
            vector = get_embedding(entry.note)
        except Exception as exc:
            print(f"AI embedding skipped: {exc}")

        data = {
            "user_id": user.id,
            "symbol": entry.symbol,
            "title": entry.title,
            "note": entry.note,
            "emotion": entry.emotion,
            "confidence": entry.confidence,
            "mistake": entry.mistake,
        }
        if vector is not None:
            data["embedding"] = vector

        response = supabase.table("journal_entries").insert(data).execute()
        return response.data
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Unable to create journal entry") from exc


@router.get("/journal")
async def get_journal(user=Depends(get_current_user)):
    response = (
        supabase.table("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data
