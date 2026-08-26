export type AssetType = 'crypto' | 'stock';

export interface SearchResult {
  symbol: string;
  name: string;
  asset_type: AssetType;
  backend_id: string;
}

export interface JournalEntry {
  id: number;
  symbol: string;
  title: string;
  note: string;
  emotion?: string;
  confidence?: number;
  mistake: boolean;
  created_at: string;
  user_id: string;
}

export interface AnalyticsStats { winRate: number; favoriteAsset: string; }
export interface WatchlistRequest { symbol: string; asset_type: AssetType; }
export interface PriceResponse { price: number; }

export interface Alert {
  id: string;
  symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  created_at: string;
}
export interface AlertRequest { symbol: string; target_price: number; condition: 'above' | 'below'; }

export interface MarketObservation {
  id: number;
  symbol: string;
  asset_name?: string | null;
  asset_type: AssetType;
  backend_id?: string | null;
  observation: string;
  price?: number | null;
  created_at: string;
}

export interface ObservationCreateRequest {
  symbol: string;
  asset_name?: string;
  asset_type: AssetType;
  backend_id?: string;
  observation: string;
  price?: number | null;
}

export interface MarketSnapshot {
  id: number;
  symbol: string;
  asset_name?: string | null;
  asset_type: AssetType;
  backend_id?: string | null;
  price?: number | null;
  note?: string | null;
  market_payload: Record<string, unknown>;
  created_at: string;
}

export interface MarketSnapshotCreateRequest {
  symbol: string;
  asset_name?: string;
  asset_type: AssetType;
  backend_id?: string;
  price?: number | null;
  note?: string;
  market_payload?: Record<string, unknown>;
}
