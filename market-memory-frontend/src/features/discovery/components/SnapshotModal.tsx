import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SearchResult } from '../../../types/contracts';

export const SnapshotModal = ({ visible, asset, onClose, onSave }: { visible: boolean; asset: SearchResult | null; onClose: () => void; onSave: (note: string) => void }) => {
  const [note, setNote] = useState('');
  const handleSave = () => { onSave(note.trim()); setNote(''); };
  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><View style={styles.modalOverlay}><View style={styles.modalContent}><Text style={styles.title}>Capture Snapshot: {asset?.symbol}</Text><TextInput style={styles.input} placeholder="Why are you interested?" placeholderTextColor="#64748b" value={note} onChangeText={setNote} multiline /><View style={styles.buttonRow}><TouchableOpacity onPress={onClose} style={styles.cancelBtn}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={handleSave} style={styles.saveBtn}><Text style={styles.saveText}>Capture</Text></TouchableOpacity></View></View></View></Modal>;
};

const styles = StyleSheet.create({ modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }, modalContent: { margin: 20, padding: 20, backgroundColor: '#1e293b', borderRadius: 12 }, title: { color: '#fff', fontSize: 18, marginBottom: 15, fontWeight: '700' }, input: { backgroundColor: '#0f172a', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, minHeight: 80 }, buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20 }, cancelBtn: { padding: 10 }, cancelText: { color: '#94a3b8' }, saveBtn: { padding: 10, paddingHorizontal: 20, backgroundColor: '#3b82f6', borderRadius: 8 }, saveText: { color: '#fff', fontWeight: '600' } });
