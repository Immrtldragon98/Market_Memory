import { supabase } from '../lib/supabase';

export const testAlertPipeline = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');
  const { error } = await supabase.from('alerts').select('id').limit(1);
  if (error) throw error;
  return true;
};
