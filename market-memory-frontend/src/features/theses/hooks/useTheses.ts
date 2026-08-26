import { useCallback, useEffect, useState } from 'react';
import { ThesisService } from '../../../services/ThesisService';
import { Thesis } from '../../../types/contracts';

export const useTheses = () => {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try { setLoading(true); setError(null); setTheses(await ThesisService.list()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load theses.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { theses, loading, error, refresh };
};
