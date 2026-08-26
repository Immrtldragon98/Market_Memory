import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SearchResult } from '../../../types/contracts';
import { styles } from './Workspace.styles';

interface WorkspaceProps {
  asset: SearchResult | null;
  livePrice: number | null;
  onAlertPress: () => void;
  onObservationPress: () => void;
  onSnapshotPress: () => void;
}

export const Workspace = memo(({ asset, livePrice, onAlertPress, onObservationPress, onSnapshotPress }: WorkspaceProps) => {
  if (!asset) {
    return <View style={styles.container}><View style={styles.chartPlaceholder}><Text style={styles.placeholderText}>Search an asset. Observe the market. Save what matters.</Text></View></View>;
  }

  return <View style={styles.container}>
    <View style={styles.card}>
      <View style={styles.header}>
        <View><Text style={styles.symbol}>{asset.symbol}</Text><Text style={styles.placeholderText}>{asset.name}</Text><Text style={styles.placeholderText}>{asset.asset_type}</Text></View>
        <Text style={styles.price}>{livePrice !== null ? `₹${livePrice.toLocaleString('en-IN')}` : '--'}</Text>
      </View>
    </View>
    <View style={styles.chartPlaceholder}><Text style={styles.placeholderText}>Market view</Text></View>
    <View style={styles.actionsRow}>
      <TouchableOpacity style={styles.actionBtn} onPress={onObservationPress}><Text style={styles.btnText}>📝 Observation</Text></TouchableOpacity>
      <TouchableOpacity style={styles.actionBtn} onPress={onSnapshotPress}><Text style={styles.btnText}>📸 Snapshot</Text></TouchableOpacity>
      <TouchableOpacity style={styles.actionBtn} onPress={onAlertPress}><Text style={styles.btnText}>🔔 Alert</Text></TouchableOpacity>
    </View>
  </View>;
});
