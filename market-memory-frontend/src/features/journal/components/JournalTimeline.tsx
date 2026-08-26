import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { JournalEntry } from '../../../types/contracts';

export const JournalTimeline = ({ entries }: { entries: JournalEntry[] | null }) => {
  if (!entries?.length) {
    return <View style={styles.emptyCard}><Text style={styles.emptyTitle}>No decision memories yet</Text><Text style={styles.empty}>Write down a decision before hindsight rewrites it.</Text></View>;
  }

  return <FlatList
    data={entries}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={styles.list}
    renderItem={({ item }) => <View style={styles.entry}>
      <View style={styles.header}><Text style={styles.asset}>{item.symbol}</Text><Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text></View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.lesson}>{item.note}</Text>
      <View style={styles.metaRow}>
        {item.confidence != null ? <Text style={styles.meta}>Confidence {item.confidence}/10</Text> : null}
        {item.emotion ? <Text style={styles.meta}>{item.emotion}</Text> : null}
        {item.mistake ? <Text style={styles.mistake}>Marked mistake</Text> : null}
      </View>
    </View>}
  />;
};

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  entry: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 14, padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  asset: { color: '#60a5fa', fontWeight: '900', fontSize: 15 },
  date: { color: '#64748b', fontSize: 11 },
  title: { color: '#f8fafc', fontSize: 17, fontWeight: '800', marginTop: 8 },
  lesson: { color: '#cbd5e1', lineHeight: 21, marginTop: 7 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  meta: { color: '#94a3b8', backgroundColor: '#0f172a', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 },
  mistake: { color: '#fca5a5', backgroundColor: '#450a0a', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 },
  emptyCard: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 14, padding: 22 },
  emptyTitle: { color: '#f8fafc', fontWeight: '800', fontSize: 17 },
  empty: { color: '#64748b', marginTop: 6 },
});
