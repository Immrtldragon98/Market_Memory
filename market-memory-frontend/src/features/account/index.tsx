import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { theme } from '../../styles/theme';
import { useJournal } from '../journal/hooks/useJournal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { useAnalytics } from './hooks/useAnalytics';

export const AccountScreen = () => {
  const { entries } = useJournal();
  const stats = useAnalytics(entries);
  return <View style={styles.container}><Text style={styles.header}>Account Overview</Text><AnalyticsDashboard data={stats} /><View style={styles.settingsSection}><Text style={styles.option}>Profile Settings</Text><Text style={styles.option}>Data Export</Text><TouchableOpacity onPress={() => supabase.auth.signOut()}><Text style={[styles.option, { color: theme.colors.danger }]}>Sign Out</Text></TouchableOpacity></View></View>;
};

const styles = StyleSheet.create({ container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }, header: { fontSize: 24, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 20 }, settingsSection: { marginTop: 30 }, option: { paddingVertical: 15, fontSize: 16, color: theme.colors.textPrimary } });
