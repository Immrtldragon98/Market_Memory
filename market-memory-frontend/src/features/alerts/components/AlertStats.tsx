import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../styles/theme';

export const AlertStats = memo(({ stats }: { stats: { created: number; triggered: number } }) => <View style={styles.card}><Text style={styles.title}>Alert Statistics</Text><Text style={styles.stat}>Created: {stats.created}</Text><Text style={styles.stat}>Triggered: {stats.triggered}</Text></View>);
const styles = StyleSheet.create({ card: { padding: 20, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.md }, title: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 8 }, stat: { color: theme.colors.textMuted } });
