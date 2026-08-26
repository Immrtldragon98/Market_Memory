import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import {
  MarketObservation,
  MarketSnapshot,
  MarketSnapshotCreateRequest,
  ObservationCreateRequest,
} from '../types/contracts';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

async function authorizedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL) throw new Error('API configuration missing.');
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data.session?.access_token;
  if (!token) throw new Error('You must be signed in.');

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try { const body = await response.json(); detail = body.detail ?? detail; } catch {}
    throw new Error(detail);
  }
  return response.json();
}

export const MemoryService = {
  createObservation(payload: ObservationCreateRequest) {
    return authorizedFetch<MarketObservation>('/api/observations', { method: 'POST', body: JSON.stringify(payload) });
  },
  listObservations(symbol?: string) {
    const query = symbol ? `?symbol=${encodeURIComponent(symbol)}` : '';
    return authorizedFetch<MarketObservation[]>(`/api/observations${query}`);
  },
  createSnapshot(payload: MarketSnapshotCreateRequest) {
    return authorizedFetch<MarketSnapshot>('/api/snapshots', { method: 'POST', body: JSON.stringify(payload) });
  },
  listSnapshots(symbol?: string) {
    const query = symbol ? `?symbol=${encodeURIComponent(symbol)}` : '';
    return authorizedFetch<MarketSnapshot[]>(`/api/snapshots${query}`);
  },
};
