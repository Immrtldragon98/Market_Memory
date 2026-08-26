from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_current_user
from app.core.database import supabase
from app.schemas.alerts import AlertCreate, AlertUpdate

router = APIRouter()


@router.post("/alerts")
async def create_alert(alert: AlertCreate, user=Depends(get_current_user)):
    try:
        response = supabase.table("alerts").insert({
            "user_id": user.id,
            "asset_symbol": alert.symbol,
            "target_price": alert.target_price,
            "condition": alert.condition,
            "is_active": True,
        }).execute()
        return response.data
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Unable to create alert") from exc


@router.get("/alerts")
async def get_alerts(user=Depends(get_current_user)):
    response = (
        supabase.table("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data


@router.patch("/alerts/{alert_id}")
async def update_alert(alert_id: int, alert: AlertUpdate, user=Depends(get_current_user)):
    payload = alert.model_dump(exclude_none=True)
    if not payload:
        return []
    response = (
        supabase.table("alerts")
        .update(payload)
        .eq("id", alert_id)
        .eq("user_id", user.id)
        .execute()
    )
    return response.data


@router.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: int, user=Depends(get_current_user)):
    response = (
        supabase.table("alerts")
        .delete()
        .eq("id", alert_id)
        .eq("user_id", user.id)
        .execute()
    )
    return {"deleted": bool(response.data)}
