from app.core.database import supabase
from app.services.coingecko import get_live_price


def get_passive_performance(user_id: str, symbol: str):
    visit = (
        supabase.table("visits")
        .select("visited_price")
        .eq("user_id", user_id)
        .eq("symbol", symbol.upper())
        .order("visited_time", asc=True)
        .limit(1)
        .execute()
        .data
    )
    if not visit:
        return None

    initial_price = float(visit[0]["visited_price"])
    if initial_price <= 0:
        return None

    current_price = get_live_price(symbol.lower())
    if current_price is None:
        return None

    change_pct = ((current_price - initial_price) / initial_price) * 100
    return {
        "symbol": symbol.upper(),
        "initial_price": initial_price,
        "current_price": current_price,
        "change_pct": round(change_pct, 2),
    }
