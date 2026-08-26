from pycoingecko import CoinGeckoAPI

cg = CoinGeckoAPI()


def get_live_price(backend_id: str):
    try:
        data = cg.get_price(ids=backend_id, vs_currencies="inr")
        return float(data[backend_id]["inr"])
    except Exception as exc:
        print(f"Error fetching price for {backend_id}: {exc}")
        return None
