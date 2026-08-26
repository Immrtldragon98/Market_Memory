import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Thesis } from '../../../types/contracts';

const STATUS_LABEL: Record<string, string> = { unknown: 'Unknown', strengthening: 'Strengthening', stable: 'Stable', weakening: 'Weakening', broken: 'Broken' };

export const ThesisCard = ({ thesis }: { thesis: Thesis }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.assetBlock}><Text style={styles.symbol}>{thesis.asset_symbol}</Text><Text style={styles.name}>{thesis.asset_name ?? thesis.asset_type}</Text></View>
      <View style={styles.badge}><Text style={styles.badgeText}>{thesis.status.toUpperCase()}</Text></View>
    </View>
    <Text style={styles.sectionLabel}>WHAT I THINK WILL HAPPEN</Text><Text style={styles.outcome}>{thesis.expected_outcome}</Text>
    <Text style={styles.sectionLabel}>WHY</Text><Text style={styles.body}>{thesis.reasoning}</Text>
    <Text style={styles.sectionLabel}>WHAT WOULD PROVE ME WRONG</Text><Text style={styles.body}>{thesis.invalidation_condition}</Text>
    <View style={styles.metaRow}><Text style={styles.meta}>Confidence {thesis.confidence}/10</Text><Text style={styles.meta}>{thesis.timeframe || 'No timeframe set'}</Text><Text style={styles.meta}>{new Date(thesis.created_at).toLocaleDateString()}</Text></View>
    <Text style={styles.sectionLabel}>ASSUMPTIONS</Text>
    {thesis.assumptions.length ? thesis.assumptions.map((assumption, index) => (
      <View key={assumption.id} style={styles.assumptionRow}><Text style={styles.assumptionIndex}>A{index + 1}</Text><View style={styles.assumptionBody}><Text style={styles.assumptionText}>{assumption.statement}</Text><Text style={styles.assumptionStatus}>{STATUS_LABEL[assumption.status] ?? assumption.status}</Text></View></View>
    )) : <Text style={styles.empty}>No assumptions recorded yet.</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#111827', borderRadius: 16, borderWidth: 1, borderColor: '#334155', padding: 20, marginBottom: 16 }, header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }, assetBlock: { flex: 1 }, symbol: { color: '#f8fafc', fontSize: 22, fontWeight: '900' }, name: { color: '#94a3b8', marginTop: 3 }, badge: { borderWidth: 1, borderColor: '#2563eb', backgroundColor: '#172554', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }, badgeText: { color: '#93c5fd', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 }, sectionLabel: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginTop: 10, marginBottom: 6 }, outcome: { color: '#f8fafc', fontSize: 17, fontWeight: '700', lineHeight: 24 }, body: { color: '#cbd5e1', lineHeight: 21 }, metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16, marginBottom: 8 }, meta: { color: '#94a3b8', backgroundColor: '#0f172a', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7, fontSize: 11 }, assumptionRow: { flexDirection: 'row', gap: 10, backgroundColor: '#0f172a', borderRadius: 10, padding: 11, marginBottom: 8 }, assumptionIndex: { color: '#60a5fa', fontWeight: '900', fontSize: 12, marginTop: 2 }, assumptionBody: { flex: 1 }, assumptionText: { color: '#e2e8f0', lineHeight: 19 }, assumptionStatus: { color: '#64748b', fontSize: 11, marginTop: 4 }, empty: { color: '#64748b', fontStyle: 'italic' },
});
