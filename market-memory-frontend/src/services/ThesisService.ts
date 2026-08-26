import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import {
  AssumptionStatus,
  EvidenceDirection,
  Thesis,
  ThesisCreateRequest,
  ThesisEvidence,
  ThesisReview,
  ThesisSnapshot,
} from '../types/contracts';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

async function authorizedFetch(path: string, init?: RequestInit) {
  if (!BASE_URL) throw new Error('API Configuration missing.');

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
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {}
    throw new Error(detail);
  }

  return response.json();
}

export const ThesisService = {
  create(payload: ThesisCreateRequest): Promise<Thesis> {
    return authorizedFetch('/api/theses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  list(symbol?: string): Promise<Thesis[]> {
    const query = symbol ? `?symbol=${encodeURIComponent(symbol)}` : '';
    return authorizedFetch(`/api/theses${query}`);
  },

  getReview(thesisId: number): Promise<ThesisReview> {
    return authorizedFetch(`/api/theses/${thesisId}/review`);
  },

  updateAssumption(thesisId: number, assumptionId: number, status: AssumptionStatus) {
    return authorizedFetch(`/api/theses/${thesisId}/assumptions/${assumptionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  addEvidence(
    thesisId: number,
    payload: {
      assumption_id?: number | null;
      direction: EvidenceDirection;
      summary: string;
      source_url?: string;
      source_title?: string;
    },
  ): Promise<ThesisEvidence> {
    return authorizedFetch(`/api/theses/${thesisId}/evidence`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  captureSnapshot(thesisId: number, marketPayload: Record<string, unknown>, note?: string): Promise<ThesisSnapshot> {
    return authorizedFetch(`/api/theses/${thesisId}/snapshots`, {
      method: 'POST',
      body: JSON.stringify({ market_payload: marketPayload, note }),
    });
  },

  listSnapshots(thesisId: number): Promise<ThesisSnapshot[]> {
    return authorizedFetch(`/api/theses/${thesisId}/snapshots`);
  },
};
