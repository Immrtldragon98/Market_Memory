from app.core.database import supabase


def send_push_notification(user_id: str, message: str):
    user_data = (
        supabase.table("profiles")
        .select("push_token")
        .eq("id", user_id)
        .maybe_single()
        .execute()
        .data
    )
    token = user_data.get("push_token") if user_data else None

    if token:
        print(f"Push queued for user {user_id}: {message}")
