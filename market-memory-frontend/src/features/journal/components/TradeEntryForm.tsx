import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { JournalEntry } from '../../../types/contracts';

export const TradeEntryForm = ({ onSave }: { onSave: (data: Omit<JournalEntry, 'id' | 'created_at' | 'user_id'>) => void }) => {
  const [symbol, setSymbol] = useState(''); const [title, setTitle] = useState(''); const [note, setNote] = useState('');
  const save = () => { if (!symbol.trim() || !title.trim() || !note.trim()) return; onSave({ symbol: symbol.trim().toUpperCase(), title: title.trim(), note: note.trim(), emotion: 'Neutral', mistake: false, confidence: 5 }); setTitle(''); setNote(''); };
  return <View style={styles.form}><TextInput style={styles.input} value={symbol} onChangeText={setSymbol} placeholder="Symbol" placeholderTextColor="#64748b" /><TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Note title" placeholderTextColor="#64748b" /><TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="What are you thinking and why?" placeholderTextColor="#64748b" multiline /><TouchableOpacity style={styles.btn} onPress={save}><Text style={styles.btnText}>Save Note</Text></TouchableOpacity></View>;
};
const styles = StyleSheet.create({ form: { padding: 20 }, input: { borderWidth: 1, borderColor: '#334155', backgroundColor: '#111827', padding: 12, marginBottom: 10, borderRadius: 8, color: '#f8fafc' }, btn: { backgroundColor: '#2563eb', padding: 15, borderRadius: 8, alignItems: 'center' }, btnText: { color: '#fff', fontWeight: 'bold' } });
