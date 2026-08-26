import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../styles/theme';
import { WatchlistPanel } from '../discovery/components/WatchlistPanel';
import { JournalTimeline } from './components/JournalTimeline';
import { TradeEntryForm } from './components/TradeEntryForm';
import { useJournal } from './hooks/useJournal';

export const JournalScreen = () => {
  const { entries, addEntry } = useJournal();
  return <View style={styles.layout}><View style={styles.sidebar}><WatchlistPanel /></View><View style={styles.workspace}><TradeEntryForm onSave={addEntry} /><JournalTimeline entries={entries} /></View></View>;
};

const styles = StyleSheet.create({ layout: { flex: 1, flexDirection: 'row', backgroundColor: theme.colors.background }, sidebar: { width: 320, borderRightWidth: 1, borderColor: theme.colors.border }, workspace: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background } });
