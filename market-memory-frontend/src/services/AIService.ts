import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import { AIReflectionResponse } from '../types/contracts';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl;

export const AIService = {
  async getCoachInsight(query: string): Promise<string> {
    if (!BASE_URL) throw new Error('API Configuration missing.');

    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const token = data.session?.access_token;
    if (!token) throw new Error('You must be signed in.');

    const response = await fetch(`${BASE_URL}/api/ai/reflect?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('AI coaching service unreachable');
    const payload: AIReflectionResponse = await response.json();
    return payload.insight;
  },
};
