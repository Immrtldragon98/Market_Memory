export interface Memory {
  id: number;
  user_id: string;
  asset_symbol: string;
  entry_price_inr: number;
  thesis: string | null;
  created_at: string;
}

export interface Alert {
  id: number;
  user_id: string;
  asset_symbol: string;
  target_price: number;
  current_price: number;
  created_at: string;
}
