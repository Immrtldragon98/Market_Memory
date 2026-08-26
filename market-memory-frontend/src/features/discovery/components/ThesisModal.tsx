import React, { useEffect, useState } from 'react';
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
import { SearchResult, Thesis, ThesisCreateRequest } from '../../../types/contracts';

interface ThesisModalProps {
  visible: boolean;
  asset: SearchResult | null;
  livePrice: number | null;
  onClose: () => void;
  onCreated?: (thesis: Thesis) => void;
}

export const ThesisModal = ({ visible, asset, livePrice, onClose, onCreated }: ThesisModalProps) => {
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [invalidation, setInvalidation] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [confidence, setConfidence] = useState('5');
  const [assumptionsText, setAssumptionsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) setError(null);
  }, [visible]);

  const reset = () => {
    setExpectedOutcome('');
    setReasoning('');
    setInvalidation('');
    setTimeframe('');
    setConfidence('5');
    setAssumptionsText('');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    if (!asset) return;
    if (!expectedOutcome.trim() || !reasoning.trim() || !invalidation.trim()) {
      setError('Outcome, reasoning, and what would prove you wrong are required.');
      return;
    }

    const parsedConfidence = Math.max(1, Math.min(10, Number(confidence) || 5));
    const assumptions = assumptionsText
      .split('\n')
      .map((item) => item.replace(/^[-•\d.)\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 20);

    const payload: ThesisCreateRequest = {
      asset_symbol: asset.symbol,
      asset_name: asset.name,
      asset_type: asset.asset_type,
      backend_id: asset.backend_id,
      expected_outcome: expectedOutcome.trim(),
      reasoning: reasoning.trim(),
      invalidation_condition: invalidation.trim(),
      timeframe: timeframe.trim() || undefined,
      confidence: parsedConfidence,
      assumptions,
    };

    try {
      setSaving(true);
      setError(null);
      const thesis = await ThesisService.create(payload);
      await ThesisService.captureSnapshot(
        thesis.id,
        {
          symbol: asset.symbol,
          asset_type: asset.asset_type,
          backend_id: asset.backend_id,
          live_price: livePrice,
          captured_from: 'thesis_creation',
        },
        'Initial thesis snapshot',
      );
      onCreated?.(thesis);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save thesis.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.kicker}>MARKET MEMORY THESIS</Text>
            <Text style={styles.title}>{asset ? `${asset.symbol} · ${asset.name}` : 'New thesis'}</Text>
            <Text style={styles.helper}>
              Capture what you believe now. Market Memory will preserve this version so future-you cannot rewrite the past.
            </Text>

            <Field label="What do you think will happen?" value={expectedOutcome} onChangeText={setExpectedOutcome} placeholder="Example: Earnings can compound faster over the next 3 years." />
            <Field label="Why do you believe it?" value={reasoning} onChangeText={setReasoning} placeholder="Explain the business logic in your own words." multiline />
            <Field label="What would prove you wrong?" value={invalidation} onChangeText={setInvalidation} placeholder="Example: Credit losses rise while underwriting standards weaken." multiline />
            <Field label="What needs to be true? · one assumption per line" value={assumptionsText} onChangeText={setAssumptionsText} placeholder={'Private-credit AUM continues growing\nCredit quality remains acceptable\nFee margins remain resilient'} multiline />

            <View style={styles.row}>
              <View style={styles.flexField}><Field label="Timeframe" value={timeframe} onChangeText={setTimeframe} placeholder="3 years" /></View>
              <View style={styles.confidenceField}><Field label="Confidence · 1–10" value={confidence} onChangeText={setConfidence} placeholder="5" keyboardType="number-pad" /></View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.buttons}>
              <TouchableOpacity onPress={handleClose} style={styles.secondaryButton} disabled={saving}><Text style={styles.secondaryText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.primaryButton} disabled={saving}>{saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Save thesis + memory</Text>}</TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
}

const Field = ({ label, value, onChangeText, placeholder, multiline, keyboardType = 'default' }: FieldProps) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, multiline && styles.multiline]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#64748b" multiline={multiline} keyboardType={keyboardType} />
  </View>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(2, 6, 23, 0.82)', padding: 20 },
  card: { width: '100%', maxWidth: 760, maxHeight: '92%', alignSelf: 'center', backgroundColor: '#111827', borderRadius: 18, borderWidth: 1, borderColor: '#334155' },
  content: { padding: 24 },
  kicker: { color: '#60a5fa', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginTop: 6 },
  helper: { color: '#94a3b8', lineHeight: 20, marginTop: 8, marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { color: '#cbd5e1', fontSize: 13, fontWeight: '700', marginBottom: 7 },
  input: { backgroundColor: '#0f172a', borderColor: '#334155', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, color: '#f8fafc' },
  multiline: { minHeight: 86, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  flexField: { flex: 1 },
  confidenceField: { width: 160 },
  error: { color: '#fca5a5', marginBottom: 14 },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
  secondaryButton: { paddingHorizontal: 18, paddingVertical: 12 },
  secondaryText: { color: '#94a3b8', fontWeight: '700' },
  primaryButton: { minWidth: 170, alignItems: 'center', backgroundColor: '#2563eb', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  primaryText: { color: '#fff', fontWeight: '800' },
});
