import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { AuthService } from '../../src/services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      const { error } = await AuthService.signIn(email.trim(), password);
      if (error) Alert.alert('Login Failed', error.message);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      {loading ? <ActivityIndicator size="large" /> : <><Button title="Login" onPress={signIn} /><View style={{ height: 20 }} /><Button title="Create Account" onPress={() => router.push('/(auth)/register')} /></>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 12, borderRadius: 8 },
});
