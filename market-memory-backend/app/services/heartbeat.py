from apscheduler.schedulers.background import BackgroundScheduler

from app.core.database import supabase
from app.services.coingecko import get_live_price
from app.services.notification import send_push_notification

_scheduler: BackgroundScheduler | None = None


def scan_alerts():
    alerts = (
        supabase.table("alerts")
        .select("*, profiles(push_enabled)")
        .eq("is_active", True)
        .execute()
        .data
        or []
    )

    for alert in alerts:
        backend_id = alert.get("backend_id") or alert.get("asset_symbol")
        current_price = get_live_price(backend_id)
        if current_price is None:
            continue

        condition = alert.get("condition", "above")
        target = float(alert["target_price"])
        triggered = current_price >= target if condition == "above" else current_price <= target
        if not triggered:
            continue

        profile = alert.get("profiles") or {}
        if profile.get("push_enabled"):
            send_push_notification(
                alert["user_id"],
                f"Alert: {alert['asset_symbol']} is at {current_price}",
            )

        (
            supabase.table("alerts")
            .update({"is_active": False})
            .eq("id", alert["id"])
            .execute()
        )


def start_heartbeat():
    global _scheduler
    if _scheduler and _scheduler.running:
        return _scheduler

    _scheduler = BackgroundScheduler()
    _scheduler.add_job(scan_alerts, "interval", seconds=60, max_instances=1, coalesce=True)
    _scheduler.start()
    return _scheduler
