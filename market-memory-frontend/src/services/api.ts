import Constants from 'expo-constants';
import { PriceResponse, SearchResult } from '../types/contracts';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

function requireBaseUrl() {
  if (!BASE_URL) throw new Error('API Configuration missing.');
  return BASE_URL;
}

export const ApiService = {
  async searchAssets(query: string): Promise<SearchResult[]> {
    const response = await fetch(`${requireBaseUrl()}/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Search failed: ${response.status}`);
    return response.json();
  },

  async fetchLivePrice(symbol: string, asset_type: 'crypto' | 'stock', backendId: string): Promise<PriceResponse> {
    const params = new URLSearchParams({ symbol, asset_type, backend_id: backendId });
    const response = await fetch(`${requireBaseUrl()}/api/price?${params.toString()}`);
    if (!response.ok) throw new Error(`Price fetch failed: ${response.status}`);
    return response.json();
  },
};
