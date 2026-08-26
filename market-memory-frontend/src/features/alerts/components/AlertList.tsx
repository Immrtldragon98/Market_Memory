import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../styles/theme';

export const AlertList = ({ alerts }: { alerts: any[] }) => (
  <View style={styles.card}><Text style={styles.title}>Active Alerts</Text><FlatList data={alerts} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <View style={styles.alertRow}><Text style={styles.text}>{item.symbol ?? item.asset_symbol}</Text><Text style={styles.price}>{item.target_price}</Text></View>} /></View>
);
const styles = StyleSheet.create({ card: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: theme.borderRadius.lg }, title: { color: theme.colors.textPrimary, fontSize: 18, marginBottom: 15 }, alertRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }, text: { color: theme.colors.textPrimary }, price: { color: theme.colors.primary } });
