import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchResult } from '../../../types/contracts';

export const SearchResults = memo(({ results, onSelect }: { results: SearchResult[]; onSelect: (asset: SearchResult) => void }) => {
  if (!results.length) return null;
  return <View style={styles.container}><FlatList keyboardShouldPersistTaps="handled" data={results} keyExtractor={(item) => `${item.asset_type}:${item.backend_id}`} renderItem={({ item }) => <TouchableOpacity style={styles.item} onPress={() => onSelect(item)} activeOpacity={0.7}><View><Text style={styles.symbol}>{item.symbol}</Text><Text style={styles.name}>{item.name}</Text></View><Text style={styles.type}>{item.asset_type}</Text></TouchableOpacity>} /></View>;
});

const styles = StyleSheet.create({ container: { maxHeight: 300, backgroundColor: '#111827', borderRadius: 8, marginHorizontal: 10, marginBottom: 10 }, item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 }, symbol: { color: '#ffffff', fontWeight: '700' }, name: { color: '#94a3b8', fontSize: 12 }, type: { color: '#3b82f6', fontSize: 10, textTransform: 'uppercase' } });
