import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SearchResult } from '../../../types/contracts';

interface Props {
  visible: boolean;
  asset: SearchResult | null;
  price: number | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (observation: string) => void;
}

export const ObservationModal = ({ visible, asset, price, saving = false, onClose, onSave }: Props) => {
  const [text, setText] = useState('');
  useEffect(() => { if (!visible) setText(''); }, [visible]);
  const save = () => { const value = text.trim(); if (value) onSave(value); };

  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View style={styles.overlay}><View style={styles.card}>
      <Text style={styles.kicker}>MARKET OBSERVATION</Text>
      <Text style={styles.title}>{asset?.symbol ?? ''}</Text>
      <Text style={styles.meta}>{price !== null ? `Observed around ₹${price.toLocaleString('en-IN')}` : 'Price unavailable'}</Text>
      <TextInput autoFocus multiline value={text} onChangeText={setText} placeholder="What are you noticing right now?" placeholderTextColor="#64748b" style={styles.input} />
      <View style={styles.row}><TouchableOpacity onPress={onClose} style={styles.cancel}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity><TouchableOpacity disabled={!text.trim() || saving} onPress={save} style={[styles.save, (!text.trim() || saving) && styles.disabled]}><Text style={styles.saveText}>{saving ? 'Saving…' : 'Remember this'}</Text></TouchableOpacity></View>
    </View></View>
  </Modal>;
};

const styles = StyleSheet.create({ overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.65)', padding: 20 }, card: { width: '100%', maxWidth: 620, alignSelf: 'center', backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155', borderRadius: 18, padding: 22 }, kicker: { color: '#60a5fa', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 }, title: { color: '#f8fafc', fontSize: 25, fontWeight: '900', marginTop: 4 }, meta: { color: '#94a3b8', marginTop: 4, marginBottom: 16 }, input: { minHeight: 150, textAlignVertical: 'top', backgroundColor: '#0f172a', color: '#f8fafc', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 14, fontSize: 16 }, row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 }, cancel: { padding: 12 }, cancelText: { color: '#94a3b8', fontWeight: '700' }, save: { backgroundColor: '#2563eb', borderRadius: 9, paddingHorizontal: 18, paddingVertical: 12 }, disabled: { opacity: 0.45 }, saveText: { color: '#fff', fontWeight: '800' } });
