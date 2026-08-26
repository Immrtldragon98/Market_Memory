from typing import Literal

from pydantic import BaseModel, Field


AssetType = Literal["crypto", "stock"]
ThesisStatus = Literal["draft", "active", "weakened", "broken", "closed"]
AssumptionStatus = Literal["unknown", "strengthening", "stable", "weakening", "broken"]
EvidenceDirection = Literal["supports", "contradicts", "neutral"]


class ThesisCreate(BaseModel):
    asset_symbol: str = Field(min_length=1, max_length=32)
    asset_name: str | None = Field(default=None, max_length=200)
    asset_type: AssetType
    backend_id: str | None = Field(default=None, max_length=200)
    expected_outcome: str = Field(min_length=3, max_length=2000)
    reasoning: str = Field(min_length=3, max_length=6000)
    invalidation_condition: str = Field(min_length=3, max_length=3000)
    timeframe: str | None = Field(default=None, max_length=200)
    confidence: int = Field(default=5, ge=1, le=10)
    assumptions: list[str] = Field(default_factory=list, max_length=20)


class ThesisUpdate(BaseModel):
    expected_outcome: str | None = Field(default=None, min_length=3, max_length=2000)
    reasoning: str | None = Field(default=None, min_length=3, max_length=6000)
    invalidation_condition: str | None = Field(default=None, min_length=3, max_length=3000)
    timeframe: str | None = Field(default=None, max_length=200)
    confidence: int | None = Field(default=None, ge=1, le=10)
    status: ThesisStatus | None = None


class AssumptionCreate(BaseModel):
    statement: str = Field(min_length=3, max_length=2000)


class AssumptionUpdate(BaseModel):
    statement: str | None = Field(default=None, min_length=3, max_length=2000)
    status: AssumptionStatus | None = None


class EvidenceCreate(BaseModel):
    assumption_id: int | None = None
    direction: EvidenceDirection
    summary: str = Field(min_length=3, max_length=4000)
    source_url: str | None = Field(default=None, max_length=2000)
    source_title: str | None = Field(default=None, max_length=500)


class SnapshotCreate(BaseModel):
    market_payload: dict = Field(default_factory=dict)
    note: str | None = Field(default=None, max_length=3000)
