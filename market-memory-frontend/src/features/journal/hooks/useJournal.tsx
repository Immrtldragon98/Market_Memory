import Constants from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { JournalEntry } from '../../../types/contracts';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

async function journalRequest(path: string, init?: RequestInit) {
  if (!BASE_URL) throw new Error('API Configuration missing.');
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data.session?.access_token;
  if (!token) throw new Error('You must be signed in.');
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`Journal request failed (${response.status})`);
  return response.json();
}

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setEntries(await journalRequest('/api/journal'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load journal.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = async (entry: Omit<JournalEntry, 'id' | 'created_at' | 'user_id'>) => {
    await journalRequest('/api/journal', { method: 'POST', body: JSON.stringify(entry) });
    await fetchEntries();
  };

  useEffect(() => { fetchEntries(); }, [fetchEntries]);
  return { entries, loading, error, addEntry, refreshEntries: fetchEntries };
};
