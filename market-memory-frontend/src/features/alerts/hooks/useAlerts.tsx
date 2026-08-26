import { useCallback, useEffect, useState } from 'react';
import { Alert } from '../../../types/contracts';
import { AlertService } from '../services/AlertService';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchAlerts = useCallback(async () => { try { setLoading(true); setError(null); setAlerts(await AlertService.getAlerts()); } catch { setError('Unable to load alerts.'); } finally { setLoading(false); } }, []);
  const createAlert = async (symbol: string, targetPrice: number, condition: 'above' | 'below' = 'above') => { try { await AlertService.createAlert({ symbol, target_price: targetPrice, condition }); await fetchAlerts(); return true; } catch { setError('Unable to create alert.'); return false; } };
  const deleteAlert = async (id: string) => { try { await AlertService.deleteAlert(id); setAlerts((prev) => prev.filter((alert) => alert.id !== id)); return true; } catch { return false; } };
  const toggleAlertStatus = async (id: string, is_active: boolean) => { try { await AlertService.updateStatus(id, is_active); await fetchAlerts(); return true; } catch { return false; } };
  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);
  return { alerts, loading, error, fetchAlerts, createAlert, deleteAlert, toggleAlertStatus };
};
