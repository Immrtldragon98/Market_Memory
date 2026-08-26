import { useMemo } from 'react';
import { JournalEntry } from '../../../types/contracts';

export const useAnalytics = (journalEntries: JournalEntry[]) => useMemo(() => {
  if (!journalEntries.length) return { winRate: 0, topAsset: 'N/A' };
  const entries = journalEntries as Array<JournalEntry & { outcome?: string }>;
  const wins = entries.filter((entry) => entry.outcome === 'win').length;
  const winRate = ((wins / entries.length) * 100).toFixed(1);
  const assetCounts = entries.reduce<Record<string, number>>((acc, entry) => { acc[entry.symbol] = (acc[entry.symbol] || 0) + 1; return acc; }, {});
  const topAsset = Object.keys(assetCounts).reduce((a, b) => assetCounts[a] > assetCounts[b] ? a : b);
  return { winRate, topAsset };
}, [journalEntries]);
