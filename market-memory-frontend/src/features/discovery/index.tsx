import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useMarketMemory } from '../../context/MarketMemoryContext';
import { MemoryService } from '../../services/MemoryService';
import { AlertService } from '../alerts/services/AlertService';
import { ObservationModal } from './components/ObservationModal';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { SnapshotModal } from './components/SnapshotModal';
import { WatchlistPanel } from './components/WatchlistPanel';
import { Workspace } from './components/Workspace';
import { useDiscovery } from './hooks/useDiscovery';

export const DiscoveryScreen = () => {
  const { workspaceAsset, livePrice, searchResults, searchAssets, selectAsset } = useDiscovery();
  const { watchlist } = useMarketMemory();
  const [snapshotVisible, setSnapshotVisible] = useState(false);
  const [observationVisible, setObservationVisible] = useState(false);
  const [savingObservation, setSavingObservation] = useState(false);

  const handleSelectAsset = useCallback((asset: any) => { selectAsset(asset); }, [selectAsset]);

  const createAlert = useCallback(async () => {
    if (!workspaceAsset || livePrice === null) return;
    try {
      await AlertService.createAlert({ symbol: workspaceAsset.symbol, target_price: livePrice * 1.05, condition: 'above' });
      Alert.alert('Alert saved', `We will remember the ₹${(livePrice * 1.05).toLocaleString('en-IN')} level.`);
    } catch (err) { Alert.alert('Could not save alert', err instanceof Error ? err.message : 'Please try again.'); }
  }, [workspaceAsset, livePrice]);

  const saveObservation = useCallback(async (observation: string) => {
    if (!workspaceAsset) return;
    setSavingObservation(true);
    try {
      await MemoryService.createObservation({ symbol: workspaceAsset.symbol, asset_name: workspaceAsset.name, asset_type: workspaceAsset.asset_type, backend_id: workspaceAsset.backend_id, observation, price: livePrice });
      setObservationVisible(false);
    } catch (err) { Alert.alert('Could not save observation', err instanceof Error ? err.message : 'Please try again.'); }
    finally { setSavingObservation(false); }
  }, [workspaceAsset, livePrice]);

  const saveSnapshot = useCallback(async (note: string) => {
    if (!workspaceAsset) return;
    try {
      await MemoryService.createSnapshot({ symbol: workspaceAsset.symbol, asset_name: workspaceAsset.name, asset_type: workspaceAsset.asset_type, backend_id: workspaceAsset.backend_id, price: livePrice, note, market_payload: { captured_price: livePrice } });
      setSnapshotVisible(false);
    } catch (err) { Alert.alert('Could not capture snapshot', err instanceof Error ? err.message : 'Please try again.'); }
  }, [workspaceAsset, livePrice]);

  return <View style={styles.container}>
    <View style={styles.sidebar}><SearchBar onSearch={searchAssets} /><SearchResults results={searchResults} onSelect={handleSelectAsset} /><WatchlistPanel assets={watchlist} selectedId={workspaceAsset?.backend_id || null} onSelect={handleSelectAsset} /></View>
    <ScrollView style={styles.mainContent} contentContainerStyle={{ flexGrow: 1 }}><Workspace asset={workspaceAsset} livePrice={livePrice} onAlertPress={createAlert} onObservationPress={() => setObservationVisible(true)} onSnapshotPress={() => setSnapshotVisible(true)} /></ScrollView>
    <ObservationModal visible={observationVisible} asset={workspaceAsset} price={livePrice} saving={savingObservation} onClose={() => setObservationVisible(false)} onSave={saveObservation} />
    <SnapshotModal visible={snapshotVisible} asset={workspaceAsset} onClose={() => setSnapshotVisible(false)} onSave={saveSnapshot} />
  </View>;
};

const styles = StyleSheet.create({ container: { flex: 1, flexDirection: 'row', backgroundColor: '#0f172a' }, sidebar: { width: 340, borderRightWidth: 1, borderRightColor: '#1e293b' }, mainContent: { flex: 1, backgroundColor: '#0f172a' } });
