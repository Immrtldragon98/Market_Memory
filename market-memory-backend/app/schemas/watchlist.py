from pydantic import BaseModel

class WatchlistCreate(BaseModel):
    symbol: str
    asset_type: str  # e.g., "crypto" or "stock"

class WatchlistUpdate(BaseModel):
    symbol: str