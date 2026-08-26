import { supabase } from '../lib/supabase';

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export const AuthService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: normalizeError(error) };
    }
  },

  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: normalizeError(error) };
    }
  },
};
