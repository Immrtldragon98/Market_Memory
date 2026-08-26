import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MemoryService } from '../../services/MemoryService';
import { MarketObservation, MarketSnapshot } from '../../types/contracts';

type MemoryItem =
  | { kind: 'observation'; at: string; value: MarketObservation }
  | { kind: 'snapshot'; at: string; value: MarketSnapshot };

export const MemoryScreen = () => {
  const [observations, setObservations] = useState<MarketObservation[]>([]);
  const [snapshots, setSnapshots] = useState<MarketSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [obs, snaps] = await Promise.all([MemoryService.listObservations(), MemoryService.listSnapshots()]);
      setObservations(obs); setSnapshots(snaps);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load memory.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const items = useMemo<MemoryItem[]>(() => [
    ...observations.map(value => ({ kind: 'observation' as const, at: value.created_at, value })),
    ...snapshots.map(value => ({ kind: 'snapshot' as const, at: value.created_at, value })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()), [observations, snapshots]);

  return <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#60a5fa" />}>
    <Text style={styles.kicker}>WHAT YOU SAW, WHEN YOU SAW IT</Text>
    <Text style={styles.title}>Market Memory</Text>
    <Text style={styles.subtitle}>Observations and snapshots are kept in time order so your past view of the market stays visible.</Text>
    {loading && !items.length ? <ActivityIndicator color="#60a5fa" style={styles.loader} /> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {!loading && !error && !items.length ? <View style={styles.empty}><Text style={styles.emptyTitle}>Nothing remembered yet</Text><Text style={styles.emptyText}>Open Market, choose an asset, then save an observation or capture a snapshot.</Text></View> : null}
    {items.map(item => item.kind === 'observation' ? <ObservationCard key={`o-${item.value.id}`} item={item.value} /> : <SnapshotCard key={`s-${item.value.id}`} item={item.value} />)}
  </ScrollView>;
};

const ObservationCard = ({ item }: { item: MarketObservation }) => <View style={styles.card}><View style={styles.row}><Text style={styles.type}>OBSERVATION</Text><Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text></View><Text style={styles.symbol}>{item.symbol}</Text><Text style={styles.body}>{item.observation}</Text><Text style={styles.price}>{item.price != null ? `Price then: ₹${item.price.toLocaleString('en-IN')}` : 'Price was unavailable'}</Text></View>;
const SnapshotCard = ({ item }: { item: MarketSnapshot }) => <View style={styles.card}><View style={styles.row}><Text style={styles.type}>SNAPSHOT</Text><Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text></View><Text style={styles.symbol}>{item.symbol}</Text><Text style={styles.body}>{item.note || 'Market state captured without a note.'}</Text><Text style={styles.price}>{item.price != null ? `Captured at ₹${item.price.toLocaleString('en-IN')}` : 'Price was unavailable'}</Text></View>;

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#0f172a' }, content: { width: '100%', maxWidth: 880, alignSelf: 'center', padding: 24 }, kicker: { color: '#60a5fa', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }, title: { color: '#f8fafc', fontSize: 30, fontWeight: '900', marginTop: 5 }, subtitle: { color: '#94a3b8', lineHeight: 21, marginTop: 8, marginBottom: 22, maxWidth: 680 }, loader: { marginTop: 30 }, error: { color: '#fca5a5', backgroundColor: '#450a0a', padding: 14, borderRadius: 10, marginBottom: 16 }, empty: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 14, padding: 24 }, emptyTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '800' }, emptyText: { color: '#94a3b8', marginTop: 6 }, card: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 14, padding: 18, marginBottom: 12 }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, type: { color: '#60a5fa', fontSize: 10, fontWeight: '900', letterSpacing: 1 }, date: { color: '#64748b', fontSize: 11 }, symbol: { color: '#f8fafc', fontSize: 20, fontWeight: '900', marginTop: 10 }, body: { color: '#cbd5e1', lineHeight: 21, marginTop: 8 }, price: { color: '#94a3b8', fontSize: 12, marginTop: 12 } });
