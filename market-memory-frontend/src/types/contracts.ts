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

export interface SearchResult {
  symbol: string;
  name: string;
  asset_type: 'crypto' | 'stock';
  backend_id: string;
}

export interface WatchlistRequest { symbol: string; asset_type: 'crypto' | 'stock'; }
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
export interface Snapshot { id: number; symbol: string; notes: string; created_at: string; chart_data_url?: string; }
export interface AIReflectionResponse { insight: string; }

export type ThesisStatus = 'draft' | 'active' | 'weakened' | 'broken' | 'closed';
export type AssumptionStatus = 'unknown' | 'strengthening' | 'stable' | 'weakening' | 'broken';
export type EvidenceDirection = 'supports' | 'contradicts' | 'neutral';

export interface ThesisAssumption {
  id: number;
  thesis_id: number;
  statement: string;
  status: AssumptionStatus;
  created_at: string;
  updated_at: string;
}

export interface ThesisEvidence {
  id: number;
  thesis_id: number;
  assumption_id?: number | null;
  direction: EvidenceDirection;
  summary: string;
  source_url?: string | null;
  source_title?: string | null;
  observed_at: string;
  created_at: string;
}

export interface Thesis {
  id: number;
  asset_symbol: string;
  asset_name?: string | null;
  asset_type: 'crypto' | 'stock';
  backend_id?: string | null;
  expected_outcome: string;
  reasoning: string;
  invalidation_condition: string;
  timeframe?: string | null;
  confidence: number;
  status: ThesisStatus;
  created_at: string;
  updated_at: string;
  assumptions: ThesisAssumption[];
  evidence: ThesisEvidence[];
}

export interface ThesisCreateRequest {
  asset_symbol: string;
  asset_name?: string;
  asset_type: 'crypto' | 'stock';
  backend_id?: string;
  expected_outcome: string;
  reasoning: string;
  invalidation_condition: string;
  timeframe?: string;
  confidence: number;
  assumptions: string[];
}
