import { useCallback, useState } from 'react';
import { ApiService } from '../../../services/api';
import { SearchResult } from '../../../types/contracts';

export const useDiscovery = () => {
  const [workspaceAsset, setWorkspaceAsset] = useState<SearchResult | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAssets = useCallback(async (query: string) => {
    if (!query.trim()) { setSearchResults([]); return; }
    try { setLoading(true); setError(null); setSearchResults(await ApiService.searchAssets(query)); }
    catch { setError('Unable to search assets.'); setSearchResults([]); }
    finally { setLoading(false); }
  }, []);

  const selectAsset = useCallback(async (asset: SearchResult) => {
    setWorkspaceAsset(asset); setSearchResults([]); setLivePrice(null);
    try { setLoading(true); setError(null); const result = await ApiService.fetchLivePrice(asset.symbol, asset.asset_type, asset.backend_id); setLivePrice(result.price); }
    catch { setError(asset.asset_type === 'stock' ? 'Stock live pricing is not connected yet.' : 'Unable to fetch live price.'); }
    finally { setLoading(false); }
  }, []);

  const refreshPrice = useCallback(async () => { if (workspaceAsset) await selectAsset(workspaceAsset); }, [workspaceAsset, selectAsset]);
  return { workspaceAsset, livePrice, searchResults, loading, error, lastVisitPrice: null, sinceLastVisit: null, searchAssets, selectAsset, refreshPrice };
};
