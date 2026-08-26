import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../styles/theme';
import { JournalTimeline } from './components/JournalTimeline';
import { TradeEntryForm } from './components/TradeEntryForm';
import { useJournal } from './hooks/useJournal';

export const JournalScreen = () => {
  const { entries, loading, error, addEntry } = useJournal();

  return <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.kicker}>DECISIONS, NOT JUST NOTES</Text>
      <Text style={styles.title}>Trading Journal</Text>
      <Text style={styles.subtitle}>Record what you decided, why you decided it, and revisit that reasoning later.</Text>
    </View>

    <View style={styles.content}>
      <View style={styles.formPane}><TradeEntryForm onSave={addEntry} /></View>
      <View style={styles.timelinePane}>
        {loading && !entries.length ? <ActivityIndicator color="#60a5fa" style={styles.loader} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <JournalTimeline entries={entries} />
      </View>
    </View>
  </View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { width: '100%', maxWidth: 1100, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 10 },
  kicker: { color: '#60a5fa', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: '#f8fafc', fontSize: 30, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#94a3b8', marginTop: 7, lineHeight: 20, maxWidth: 660 },
  content: { flex: 1, width: '100%', maxWidth: 1100, alignSelf: 'center', flexDirection: 'row', gap: 18, padding: 24, paddingTop: 12 },
  formPane: { width: 390 },
  timelinePane: { flex: 1, minWidth: 0 },
  loader: { marginTop: 28 },
  error: { color: '#fca5a5', backgroundColor: '#450a0a', padding: 12, borderRadius: 10, marginBottom: 10 },
});
