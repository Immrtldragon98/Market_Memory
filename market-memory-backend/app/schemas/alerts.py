from pydantic import BaseModel
from typing import Optional

class AlertCreate(BaseModel):
    symbol: str
    target_price: float
    condition: str  # e.g., "above" or "below"

class AlertUpdate(BaseModel):
    target_price: Optional[float]
    is_active: Optional[bool]