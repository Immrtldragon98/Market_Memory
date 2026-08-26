export type AlertCondition = 'above' | 'below';
export type AlertStatus = 'active' | 'paused' | 'triggered';

export interface Alert {
  id: string;
  symbol: string;
  name: string;
  asset_type: 'crypto' | 'stock';
  backend_id: string;
  currentPrice: number;
  targetPrice: number;
  condition: AlertCondition;
  status: 'active' | 'triggered';
  is_active: boolean;
  createdAt: string;
}
