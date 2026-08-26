import Constants from 'expo-constants';
import { supabase } from '../../../lib/supabase';
import { Alert, AlertRequest } from '../../../types/contracts';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

async function request(path: string, init?: RequestInit) {
  if (!BASE_URL) throw new Error('API Configuration missing.');
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data.session?.access_token;
  if (!token) throw new Error('You must be signed in.');
  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) } });
  if (!response.ok) throw new Error(`Alert request failed (${response.status})`);
  return response.json();
}

export const AlertService = {
  getAlerts(): Promise<Alert[]> { return request('/api/alerts'); },
  createAlert(alert: AlertRequest) { return request('/api/alerts', { method: 'POST', body: JSON.stringify(alert) }); },
  deleteAlert(id: string) { return request(`/api/alerts/${id}`, { method: 'DELETE' }); },
  updateStatus(id: string, is_active: boolean) { return request(`/api/alerts/${id}`, { method: 'PATCH', body: JSON.stringify({ is_active }) }); },
};
