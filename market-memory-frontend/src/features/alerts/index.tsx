import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../styles/theme';
import { AlertList } from './components/AlertList';
import { AlertStats } from './components/AlertStats';
import { useAlerts } from './hooks/useAlerts';

export const AlertsScreen = () => { const { alerts } = useAlerts(); return <View style={styles.container}><AlertStats stats={{ created: alerts.length, triggered: alerts.filter((a) => !a.is_active).length }} /><AlertList alerts={alerts} /></View>; };
const styles = StyleSheet.create({ container: { flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background } });
