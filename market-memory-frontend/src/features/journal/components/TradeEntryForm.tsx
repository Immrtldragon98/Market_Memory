import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { JournalEntry } from '../../../types/contracts';

export const TradeEntryForm = ({ onSave }: { onSave: (data: Omit<JournalEntry, 'id' | 'created_at' | 'user_id'>) => Promise<void> | void }) => {
  const [symbol, setSymbol] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [confidence, setConfidence] = useState('5');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const cleanSymbol = symbol.trim().toUpperCase();
    const cleanTitle = title.trim();
    const cleanNote = note.trim();
    const parsedConfidence = Math.max(1, Math.min(10, Number(confidence) || 5));
    if (!cleanSymbol || !cleanTitle || !cleanNote || saving) return;

    setSaving(true);
    try {
      await onSave({
        symbol: cleanSymbol,
        title: cleanTitle,
        note: cleanNote,
        emotion: 'Neutral',
        mistake: false,
        confidence: parsedConfidence,
      });
      setTitle('');
      setNote('');
      setConfidence('5');
    } finally {
      setSaving(false);
    }
  };

  return <View style={styles.form}>
    <Text style={styles.label}>ASSET</Text>
    <TextInput style={styles.input} value={symbol} onChangeText={setSymbol} autoCapitalize="characters" placeholder="BTC, ETH, AAPL…" placeholderTextColor="#64748b" />

    <Text style={styles.label}>DECISION / IDEA</Text>
    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="What are you considering?" placeholderTextColor="#64748b" />

    <Text style={styles.label}>WHY</Text>
    <TextInput style={[styles.input, styles.note]} value={note} onChangeText={setNote} placeholder="Write the reasoning you want your future self to remember." placeholderTextColor="#64748b" multiline />

    <Text style={styles.label}>CONFIDENCE · 1–10</Text>
    <TextInput style={styles.input} value={confidence} onChangeText={setConfidence} keyboardType="number-pad" placeholder="5" placeholderTextColor="#64748b" />

    <TouchableOpacity style={[styles.btn, saving && styles.disabled]} disabled={saving} onPress={save}>
      <Text style={styles.btnText}>{saving ? 'Saving…' : 'Save decision memory'}</Text>
    </TouchableOpacity>
  </View>;
};

const styles = StyleSheet.create({
  form: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 16, padding: 18 },
  label: { color: '#64748b', fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 6, marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#334155', backgroundColor: '#0f172a', padding: 12, marginBottom: 12, borderRadius: 9, color: '#f8fafc' },
  note: { minHeight: 130, textAlignVertical: 'top' },
  btn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 9, alignItems: 'center', marginTop: 2 },
  disabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '800' },
});
