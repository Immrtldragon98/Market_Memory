import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchResult } from '../../../types/contracts';

export interface WatchlistAsset extends SearchResult { price?: number; change_pct?: number; }

export const WatchlistPanel = ({ assets = [], selectedId = null, onSelect }: { assets?: WatchlistAsset[]; selectedId?: string | null; onSelect?: (asset: WatchlistAsset) => void }) => {
  if (!assets.length) return <View style={styles.empty}><Text style={styles.emptyTitle}>Watchlist</Text><Text style={styles.emptyText}>Add assets you want to keep researching.</Text></View>;
  return <FlatList data={assets} keyExtractor={(item) => `${item.asset_type}:${item.backend_id}`} renderItem={({ item }) => <TouchableOpacity style={[styles.item, selectedId === item.backend_id && styles.selected]} onPress={() => onSelect?.(item)} disabled={!onSelect}><View style={styles.row}><Text style={styles.symbol}>{item.symbol}</Text><Text style={styles.price}>{item.price != null ? `₹${item.price.toLocaleString('en-IN')}` : '--'}</Text></View><Text style={styles.name}>{item.name}</Text>{item.change_pct != null ? <Text style={[styles.change, { color: item.change_pct >= 0 ? '#22C55E' : '#EF4444' }]}>{item.change_pct}%</Text> : null}</TouchableOpacity>} />;
};

const styles = StyleSheet.create({ item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#334155' }, selected: { backgroundColor: '#1E293B' }, row: { flexDirection: 'row', justifyContent: 'space-between' }, symbol: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }, price: { color: '#FFFFFF' }, name: { color: '#94A3B8', fontSize: 12 }, change: { fontSize: 12, marginTop: 4 }, empty: { padding: 18 }, emptyTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700' }, emptyText: { color: '#64748b', marginTop: 6, lineHeight: 18 } });
