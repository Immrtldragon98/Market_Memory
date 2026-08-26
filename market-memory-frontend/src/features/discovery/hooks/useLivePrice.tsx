import { useEffect, useState } from 'react';
import { ApiService } from '../../../services/api';

export const useLivePrice = (symbol: string, asset_type: 'crypto' | 'stock', backendId: string) => {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    if (!symbol || !backendId) return;
    let cancelled = false;
    const getPrice = async () => { try { const data = await ApiService.fetchLivePrice(symbol, asset_type, backendId); if (!cancelled) setPrice(data.price); } catch {} };
    getPrice();
    const interval = setInterval(getPrice, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [symbol, asset_type, backendId]);
  return { price };
};
