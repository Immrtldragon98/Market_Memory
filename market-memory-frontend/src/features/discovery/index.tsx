import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useMarketMemory } from '../../context/MarketMemoryContext';
import { AlertService } from '../alerts/services/AlertService';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { SnapshotModal } from './components/SnapshotModal';
import { ThesisModal } from './components/ThesisModal';
import { WatchlistPanel } from './components/WatchlistPanel';
import { Workspace } from './components/Workspace';
import { useDiscovery } from './hooks/useDiscovery';

export const DiscoveryScreen = () => {
  const { workspaceAsset, livePrice, searchResults, searchAssets, selectAsset } = useDiscovery();
  const { watchlist } = useMarketMemory();
  const [snapshotVisible, setSnapshotVisible] = useState(false);
  const [thesisVisible, setThesisVisible] = useState(false);

  const handleSelectAsset = useCallback((asset: any) => { selectAsset(asset); }, [selectAsset]);
  const createAlert = useCallback(async (targetPrice: number, condition: 'above' | 'below') => {
    if (!workspaceAsset || livePrice === null || targetPrice <= 0) return;
    try { await AlertService.createAlert({ symbol: workspaceAsset.symbol, target_price: targetPrice, condition }); }
    catch (err) { console.error('Failed to create alert:', err); }
  }, [workspaceAsset, livePrice]);

  return <View style={styles.container}><View style={styles.sidebar}><SearchBar onSearch={searchAssets} /><SearchResults results={searchResults} onSelect={handleSelectAsset} /><WatchlistPanel assets={watchlist} selectedId={workspaceAsset?.backend_id || null} onSelect={handleSelectAsset} /></View><ScrollView style={styles.mainContent} contentContainerStyle={{ flexGrow: 1 }}><Workspace asset={workspaceAsset} livePrice={livePrice} onAlertPress={() => createAlert(livePrice ? livePrice * 1.05 : 0, 'above')} onNotePress={() => {}} onSnapshotPress={() => setSnapshotVisible(true)} onThesisPress={() => setThesisVisible(true)} /></ScrollView><SnapshotModal visible={snapshotVisible} asset={workspaceAsset} onClose={() => setSnapshotVisible(false)} onSave={(note) => { console.log('Snapshot note:', note); setSnapshotVisible(false); }} /><ThesisModal visible={thesisVisible} asset={workspaceAsset} livePrice={livePrice} onClose={() => setThesisVisible(false)} /></View>;
};

const styles = StyleSheet.create({ container: { flex: 1, flexDirection: 'row', backgroundColor: '#0f172a' }, sidebar: { width: 340, borderRightWidth: 1, borderRightColor: '#1e293b' }, mainContent: { flex: 1, backgroundColor: '#0f172a' } });
