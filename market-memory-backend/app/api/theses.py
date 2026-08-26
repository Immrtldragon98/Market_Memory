from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user
from app.core.database import supabase
from app.schemas.thesis import (
    AssumptionCreate,
    AssumptionUpdate,
    EvidenceCreate,
    SnapshotCreate,
    ThesisCreate,
    ThesisUpdate,
)

router = APIRouter()


def _one(data, detail: str):
    if not data:
        raise HTTPException(status_code=404, detail=detail)
    return data[0]


def _owned_thesis(thesis_id: int, user_id: str):
    response = (
        supabase.table("theses")
        .select("*")
        .eq("id", thesis_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    return _one(response.data, "Thesis not found")


def _hydrate_thesis(thesis: dict, user_id: str):
    thesis_id = thesis["id"]
    assumptions = (
        supabase.table("thesis_assumptions")
        .select("*")
        .eq("thesis_id", thesis_id)
        .eq("user_id", user_id)
        .order("created_at")
        .execute()
    ).data
    evidence = (
        supabase.table("thesis_evidence")
        .select("*")
        .eq("thesis_id", thesis_id)
        .eq("user_id", user_id)
        .order("observed_at", desc=True)
        .execute()
    ).data
    return {**thesis, "assumptions": assumptions or [], "evidence": evidence or []}


@router.post("/theses", status_code=status.HTTP_201_CREATED)
async def create_thesis(payload: ThesisCreate, user=Depends(get_current_user)):
    clean_assumptions = [a.strip() for a in payload.assumptions if a.strip()]
    thesis_data = payload.model_dump(exclude={"assumptions"})
    thesis_data.update({
        "user_id": user.id,
        "asset_symbol": thesis_data["asset_symbol"].strip().upper(),
    })

    try:
        created = supabase.table("theses").insert(thesis_data).execute().data
        thesis = _one(created, "Unable to create thesis")

        if clean_assumptions:
            rows = [
                {"thesis_id": thesis["id"], "user_id": user.id, "statement": statement}
                for statement in clean_assumptions
            ]
            supabase.table("thesis_assumptions").insert(rows).execute()

        return _hydrate_thesis(thesis, user.id)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Unable to create thesis") from exc


@router.get("/theses")
async def list_theses(symbol: str | None = None, user=Depends(get_current_user)):
    query = supabase.table("theses").select("*").eq("user_id", user.id)
    if symbol:
        query = query.eq("asset_symbol", symbol.strip().upper())
    rows = query.order("created_at", desc=True).execute().data or []
    return [_hydrate_thesis(row, user.id) for row in rows]


@router.get("/theses/{thesis_id}")
async def get_thesis(thesis_id: int, user=Depends(get_current_user)):
    return _hydrate_thesis(_owned_thesis(thesis_id, user.id), user.id)


@router.patch("/theses/{thesis_id}")
async def update_thesis(thesis_id: int, payload: ThesisUpdate, user=Depends(get_current_user)):
    _owned_thesis(thesis_id, user.id)
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        return _hydrate_thesis(_owned_thesis(thesis_id, user.id), user.id)
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    rows = (
        supabase.table("theses")
        .update(updates)
        .eq("id", thesis_id)
        .eq("user_id", user.id)
        .execute()
    ).data
    return _hydrate_thesis(_one(rows, "Thesis not found"), user.id)


@router.post("/theses/{thesis_id}/assumptions", status_code=status.HTTP_201_CREATED)
async def add_assumption(thesis_id: int, payload: AssumptionCreate, user=Depends(get_current_user)):
    _owned_thesis(thesis_id, user.id)
    rows = supabase.table("thesis_assumptions").insert({
        "thesis_id": thesis_id,
        "user_id": user.id,
        "statement": payload.statement.strip(),
    }).execute().data
    return _one(rows, "Unable to create assumption")


@router.patch("/theses/{thesis_id}/assumptions/{assumption_id}")
async def update_assumption(
    thesis_id: int,
    assumption_id: int,
    payload: AssumptionUpdate,
    user=Depends(get_current_user),
):
    _owned_thesis(thesis_id, user.id)
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No changes supplied")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    rows = (
        supabase.table("thesis_assumptions")
        .update(updates)
        .eq("id", assumption_id)
        .eq("thesis_id", thesis_id)
        .eq("user_id", user.id)
        .execute()
    ).data
    return _one(rows, "Assumption not found")


@router.post("/theses/{thesis_id}/evidence", status_code=status.HTTP_201_CREATED)
async def add_evidence(thesis_id: int, payload: EvidenceCreate, user=Depends(get_current_user)):
    _owned_thesis(thesis_id, user.id)
    if payload.assumption_id is not None:
        assumption = (
            supabase.table("thesis_assumptions")
            .select("id")
            .eq("id", payload.assumption_id)
            .eq("thesis_id", thesis_id)
            .eq("user_id", user.id)
            .limit(1)
            .execute()
        ).data
        if not assumption:
            raise HTTPException(status_code=400, detail="Assumption does not belong to this thesis")

    data = payload.model_dump()
    data.update({"thesis_id": thesis_id, "user_id": user.id})
    rows = supabase.table("thesis_evidence").insert(data).execute().data
    return _one(rows, "Unable to add evidence")


@router.post("/theses/{thesis_id}/snapshots", status_code=status.HTTP_201_CREATED)
async def create_snapshot(thesis_id: int, payload: SnapshotCreate, user=Depends(get_current_user)):
    thesis = _hydrate_thesis(_owned_thesis(thesis_id, user.id), user.id)
    data = {
        "thesis_id": thesis_id,
        "user_id": user.id,
        "thesis_payload": thesis,
        "market_payload": payload.market_payload,
        "note": payload.note,
    }
    rows = supabase.table("thesis_snapshots").insert(data).execute().data
    return _one(rows, "Unable to capture snapshot")


@router.get("/theses/{thesis_id}/snapshots")
async def list_snapshots(thesis_id: int, user=Depends(get_current_user)):
    _owned_thesis(thesis_id, user.id)
    return (
        supabase.table("thesis_snapshots")
        .select("*")
        .eq("thesis_id", thesis_id)
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .execute()
    ).data or []
