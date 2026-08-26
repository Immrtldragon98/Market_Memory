import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { JournalEntry } from '../../../types/contracts';

export const JournalTimeline = ({ entries }: { entries: JournalEntry[] | null }) => {
  if (!entries?.length) return <Text style={styles.empty}>No entries yet. Record your first investment note.</Text>;
  return <FlatList data={entries} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <View style={styles.entry}><Text style={styles.asset}>{item.symbol}</Text><Text style={styles.lesson}>{item.note}</Text></View>} />;
};
const styles = StyleSheet.create({ entry: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#1e293b' }, asset: { color: '#3b82f6', fontWeight: 'bold' }, lesson: { color: '#cbd5e1' }, empty: { color: '#64748b', textAlign: 'center', marginTop: 20 } });
