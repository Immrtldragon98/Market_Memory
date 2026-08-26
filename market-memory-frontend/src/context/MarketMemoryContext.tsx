import React, { createContext, useContext, useMemo, useState } from 'react';
import { SearchResult } from '../types/contracts';

interface MemoryItem extends SearchResult {
  id: string;
  price?: number;
}

interface MarketMemoryContextType {
  watchlist: MemoryItem[];
  setWatchlist: React.Dispatch<React.SetStateAction<MemoryItem[]>>;
}

const MarketMemoryContext = createContext<MarketMemoryContextType | undefined>(undefined);

export const MarketMemoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [watchlist, setWatchlist] = useState<MemoryItem[]>([]);
  const value = useMemo(() => ({ watchlist, setWatchlist }), [watchlist]);
  return <MarketMemoryContext.Provider value={value}>{children}</MarketMemoryContext.Provider>;
};

export const useMarketMemory = () => {
  const context = useContext(MarketMemoryContext);
  if (!context) throw new Error('useMarketMemory must be used inside MarketMemoryProvider');
  return context;
};
