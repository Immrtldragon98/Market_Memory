import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThesisService } from '../../../services/ThesisService';
import {
  AssumptionStatus,
  EvidenceDirection,
  Thesis,
  ThesisReview,
} from '../../../types/contracts';

const ASSUMPTION_STATES: AssumptionStatus[] = [
  'strengthening',
  'stable',
  'weakening',
  'broken',
];

const EVIDENCE_DIRECTIONS: EvidenceDirection[] = [
  'supports',
  'contradicts',
  'neutral',
];

interface Props {
  visible: boolean;
  thesis: Thesis | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export const ThesisReviewModal = ({ visible, thesis, onClose, onUpdated }: Props) => {
  const [review, setReview] = useState<ThesisReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssumptionId, setSelectedAssumptionId] = useState<number | null>(null);
  const [direction, setDirection] = useState<EvidenceDirection>('supports');
  const [evidence, setEvidence] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const loadReview = useCallback(async () => {
    if (!thesis) return;
    try {
      setLoading(true);
      setError(null);
      setReview(await ThesisService.getReview(thesis.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load thesis review.');
    } finally {
      setLoading(false);
    }
  }, [thesis]);

  useEffect(() => {
    if (visible) loadReview();
    else {
      setReview(null);
      setSelectedAssumptionId(null);
      setEvidence('');
      setSourceTitle('');
      setSourceUrl('');
      setError(null);
    }
  }, [visible, loadReview]);

  const updateStatus = async (assumptionId: number, status: AssumptionStatus) => {
    if (!thesis) return;
    try {
      setSaving(true);
      setError(null);
      await ThesisService.updateAssumption(thesis.id, assumptionId, status);
      await loadReview();
      onUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update assumption.');
    } finally {
      setSaving(false);
    }
  };

  const addEvidence = async () => {
    if (!thesis || !selectedAssumptionId || !evidence.trim()) return;
    try {
      setSaving(true);
      setError(null);
      await ThesisService.addEvidence(thesis.id, {
        assumption_id: selectedAssumptionId,
        direction,
        summary: evidence.trim(),
        source_title: sourceTitle.trim() || undefined,
        source_url: sourceUrl.trim() || undefined,
      });
      setEvidence('');
      setSourceTitle('');
      setSourceUrl('');
      await loadReview();
      onUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add evidence.');
    } finally {
      setSaving(false);
    }
  };

  const current = review?.current ?? thesis;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.headerRow}>
              <View style={styles.headerCopy}>
                <Text style={styles.kicker}>THESIS REVIEW</Text>
                <Text style={styles.title}>{current?.asset_symbol ?? 'Thesis'}</Text>
                <Text style={styles.subtitle}>Update what changed. Preserve why it changed.</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            {loading && !review ? <ActivityIndicator color="#60a5fa" style={styles.loader} /> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {review ? (
              <>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>CURRENT THESIS HEALTH</Text>
                  <Text style={styles.health}>{review.health.toUpperCase()}</Text>
                  <Text style={styles.summaryText}>
                    {review.assumption_summary.strengthening} strengthening · {review.assumption_summary.stable} stable · {review.assumption_summary.weakening} weakening · {review.assumption_summary.broken} broken
                  </Text>
                  <Text style={styles.summaryText}>
                    Evidence: {review.evidence_summary.supports} supports · {review.evidence_summary.contradicts} contradicts · {review.evidence_summary.neutral} neutral
                  </Text>
                </View>

                <View style={[styles.driftCard, review.drift.core_reasoning_changed && styles.driftWarning]}>
                  <Text style={styles.summaryLabel}>ORIGINAL VS NOW</Text>
                  <Text style={styles.driftTitle}>
                    {review.drift.core_reasoning_changed ? 'Your core reasoning has changed.' : 'Your core reasoning still matches the original thesis.'}
                  </Text>
                  {review.drift.core_reasoning_changed ? (
                    <Text style={styles.driftText}>
                      Market Memory is flagging this rather than judging it. A changed thesis can be valid, but it should be acknowledged instead of silently rewriting the past.
                    </Text>
                  ) : null}
                  {review.drift.confidence_changed ? <Text style={styles.driftText}>Your confidence is also different from the original snapshot.</Text> : null}
                </View>

                <Text style={styles.sectionTitle}>Assumptions</Text>
                <Text style={styles.sectionHelp}>For each assumption, mark what the evidence says today.</Text>

                {review.current.assumptions.map((assumption, index) => (
                  <View key={assumption.id} style={styles.assumptionCard}>
                    <View style={styles.assumptionHeader}>
                      <Text style={styles.assumptionIndex}>A{index + 1}</Text>
                      <Text style={styles.assumptionText}>{assumption.statement}</Text>
                    </View>
                    <View style={styles.statusRow}>
                      {ASSUMPTION_STATES.map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[styles.statusChip, assumption.status === status && styles.statusChipActive]}
                          onPress={() => updateStatus(assumption.id, status)}
                          disabled={saving}
                        >
                          <Text style={[styles.statusText, assumption.status === status && styles.statusTextActive]}>{status}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity
                      onPress={() => setSelectedAssumptionId(assumption.id)}
                      style={[styles.evidenceButton, selectedAssumptionId === assumption.id && styles.evidenceButtonActive]}
                    >
                      <Text style={styles.evidenceButtonText}>{selectedAssumptionId === assumption.id ? 'Evidence form open ↓' : '+ Add evidence'}</Text>
                    </TouchableOpacity>

                    {selectedAssumptionId === assumption.id ? (
                      <View style={styles.evidenceForm}>
                        <View style={styles.directionRow}>
                          {EVIDENCE_DIRECTIONS.map((item) => (
                            <TouchableOpacity
                              key={item}
                              style={[styles.directionChip, direction === item && styles.directionChipActive]}
                              onPress={() => setDirection(item)}
                            >
                              <Text style={[styles.directionText, direction === item && styles.directionTextActive]}>{item}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <TextInput
                          value={evidence}
                          onChangeText={setEvidence}
                          placeholder="What changed? What did you learn?"
                          placeholderTextColor="#64748b"
                          multiline
                          style={[styles.input, styles.multiline]}
                        />
                        <TextInput value={sourceTitle} onChangeText={setSourceTitle} placeholder="Source title · optional" placeholderTextColor="#64748b" style={styles.input} />
                        <TextInput value={sourceUrl} onChangeText={setSourceUrl} placeholder="Source URL · optional" placeholderTextColor="#64748b" autoCapitalize="none" style={styles.input} />
                        <TouchableOpacity style={styles.saveEvidence} onPress={addEvidence} disabled={saving || !evidence.trim()}>
                          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveEvidenceText}>Save evidence</Text>}
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                ))}

                <Text style={styles.sectionTitle}>Evidence history</Text>
                {!review.current.evidence.length ? <Text style={styles.empty}>No evidence recorded yet.</Text> : null}
                {review.current.evidence.map((item) => (
                  <View key={item.id} style={styles.historyRow}>
                    <Text style={styles.historyDirection}>{item.direction.toUpperCase()}</Text>
                    <View style={styles.historyBody}>
                      <Text style={styles.historyText}>{item.summary}</Text>
                      <Text style={styles.historyMeta}>{item.source_title || new Date(item.observed_at).toLocaleDateString()}</Text>
                    </View>
                  </View>
                ))}
              </>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.88)', justifyContent: 'center', padding: 18 },
  card: { width: '100%', maxWidth: 900, maxHeight: '94%', alignSelf: 'center', backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 18 },
  content: { padding: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  headerCopy: { flex: 1 },
  kicker: { color: '#60a5fa', fontSize: 11, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: '#f8fafc', fontSize: 28, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#94a3b8', marginTop: 4 },
  closeButton: { paddingHorizontal: 12, paddingVertical: 8 },
  closeText: { color: '#94a3b8', fontWeight: '700' },
  loader: { marginVertical: 30 },
  error: { color: '#fecaca', backgroundColor: '#450a0a', borderRadius: 9, padding: 12, marginTop: 16 },
  summaryCard: { marginTop: 20, padding: 16, borderRadius: 12, backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155' },
  summaryLabel: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  health: { color: '#f8fafc', fontSize: 20, fontWeight: '900', marginTop: 6 },
  summaryText: { color: '#94a3b8', marginTop: 6 },
  driftCard: { marginTop: 12, padding: 16, borderRadius: 12, backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155' },
  driftWarning: { borderColor: '#d97706', backgroundColor: '#2b1a06' },
  driftTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '800', marginTop: 6 },
  driftText: { color: '#cbd5e1', lineHeight: 20, marginTop: 7 },
  sectionTitle: { color: '#f8fafc', fontSize: 19, fontWeight: '900', marginTop: 24 },
  sectionHelp: { color: '#94a3b8', marginTop: 4, marginBottom: 12 },
  assumptionCard: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 14, marginBottom: 10 },
  assumptionHeader: { flexDirection: 'row', gap: 10 },
  assumptionIndex: { color: '#60a5fa', fontWeight: '900' },
  assumptionText: { color: '#e2e8f0', flex: 1, lineHeight: 20 },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  statusChip: { borderWidth: 1, borderColor: '#334155', backgroundColor: '#0f172a', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusChipActive: { borderColor: '#3b82f6', backgroundColor: '#172554' },
  statusText: { color: '#94a3b8', fontSize: 11, textTransform: 'capitalize' },
  statusTextActive: { color: '#bfdbfe', fontWeight: '800' },
  evidenceButton: { alignSelf: 'flex-start', marginTop: 12, paddingVertical: 6 },
  evidenceButtonActive: { opacity: 0.9 },
  evidenceButtonText: { color: '#60a5fa', fontWeight: '700' },
  evidenceForm: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1e293b' },
  directionRow: { flexDirection: 'row', gap: 7, marginBottom: 10 },
  directionChip: { borderWidth: 1, borderColor: '#334155', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  directionChipActive: { borderColor: '#60a5fa', backgroundColor: '#172554' },
  directionText: { color: '#94a3b8', textTransform: 'capitalize', fontSize: 12 },
  directionTextActive: { color: '#dbeafe', fontWeight: '800' },
  input: { backgroundColor: '#020617', borderWidth: 1, borderColor: '#334155', color: '#f8fafc', borderRadius: 9, paddingHorizontal: 11, paddingVertical: 10, marginBottom: 8 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  saveEvidence: { backgroundColor: '#2563eb', borderRadius: 9, paddingVertical: 11, alignItems: 'center', marginTop: 2 },
  saveEvidenceText: { color: '#fff', fontWeight: '800' },
  empty: { color: '#64748b', marginTop: 10 },
  historyRow: { flexDirection: 'row', gap: 10, backgroundColor: '#111827', borderRadius: 10, padding: 12, marginTop: 8 },
  historyDirection: { width: 88, color: '#60a5fa', fontSize: 10, fontWeight: '900' },
  historyBody: { flex: 1 },
  historyText: { color: '#e2e8f0', lineHeight: 19 },
  historyMeta: { color: '#64748b', fontSize: 11, marginTop: 4 },
});
