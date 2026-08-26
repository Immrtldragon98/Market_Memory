import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '../../src/services/authService';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const { error } = await AuthService.signUp(email, password);
    setLoading(false);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
      return;
    }
    Alert.alert('Success', 'Check your email to confirm your account.');
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      {loading ? <ActivityIndicator size="small" /> : <Button title="Create Account" onPress={signUp} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  input: { borderWidth: 1, marginBottom: 12, padding: 12, borderRadius: 8 },
});
