import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AnalyticsDashboard = ({ data }: { data: { winRate: string | number; topAsset: string } }) => (
  <View style={styles.container}><Text style={styles.title}>Reasoning Activity</Text><Text style={styles.text}>Journal win tags: {data.winRate}%</Text><Text style={styles.text}>Most researched: {data.topAsset}</Text></View>
);

const styles = StyleSheet.create({ container: { padding: 20 }, title: { color: '#fff', fontSize: 20, marginBottom: 15 }, text: { color: '#94a3b8', fontSize: 16 } });
