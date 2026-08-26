from pydantic import BaseModel
from typing import Optional

class JournalEntryCreate(BaseModel):
    symbol: str
    title: str
    note: str
    emotion: Optional[str] = None
    confidence: Optional[int] = None
    mistake: Optional[bool] = False

class JournalEntry(JournalEntryCreate):
    id: int
    user_id: str
    created_at: str

    class Config:
        from_attributes = True