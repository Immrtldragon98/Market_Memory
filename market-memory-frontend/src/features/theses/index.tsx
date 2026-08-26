import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Thesis } from '../../types/contracts';
import { ThesisCard } from './components/ThesisCard';
import { ThesisReviewModal } from './components/ThesisReviewModal';
import { useTheses } from './hooks/useTheses';

export const ThesesScreen = () => {
  const { theses, loading, error, refresh } = useTheses();
  const [reviewing, setReviewing] = useState<Thesis | null>(null);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#60a5fa" />}
      >
        <Text style={styles.kicker}>YOUR REASONING, PRESERVED</Text>
        <Text style={styles.title}>Investment Theses</Text>
        <Text style={styles.subtitle}>
          Record what you believed, then review whether the assumptions and evidence still support it.
        </Text>

        {loading && !theses.length ? <ActivityIndicator color="#60a5fa" style={styles.loader} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!loading && !error && !theses.length ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No theses yet</Text>
            <Text style={styles.emptyText}>Open Discovery, select an asset, then choose 🧠 Thesis.</Text>
          </View>
        ) : null}

        {theses.map((thesis) => (
          <ThesisCard key={thesis.id} thesis={thesis} onReview={setReviewing} />
        ))}
      </ScrollView>

      <ThesisReviewModal
        visible={Boolean(reviewing)}
        thesis={reviewing}
        onClose={() => setReviewing(null)}
        onUpdated={refresh}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { width: '100%', maxWidth: 960, alignSelf: 'center', padding: 24 },
  kicker: { color: '#60a5fa', fontSize: 11, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: '#f8fafc', fontSize: 30, fontWeight: '900', marginTop: 5 },
  subtitle: { color: '#94a3b8', maxWidth: 680, lineHeight: 21, marginTop: 8, marginBottom: 22 },
  loader: { marginTop: 30 },
  error: { color: '#fca5a5', backgroundColor: '#450a0a', padding: 14, borderRadius: 10, marginBottom: 16 },
  emptyCard: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 14, padding: 24 },
  emptyTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '800' },
  emptyText: { color: '#94a3b8', marginTop: 6 },
});
