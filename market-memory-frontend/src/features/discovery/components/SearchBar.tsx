import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed.length >= 2) onSearch(trimmed);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);
  return <View style={styles.container}><TextInput style={styles.input} placeholder="Search BTC, ETH, AAPL..." placeholderTextColor="#64748b" value={query} onChangeText={setQuery} /></View>;
};

const styles = StyleSheet.create({ container: { padding: 10 }, input: { backgroundColor: '#1E293B', color: '#FFFFFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155' } });
