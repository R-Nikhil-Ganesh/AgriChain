import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, SegmentedButtons } from 'react-native-paper';

// This is a simplified version. In a real app, fields would change based on role.
export default function AuthScreen({ route, navigation }) {
  const { role } = route.params;
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration

  const handleAuth = () => {
    // TODO: Implement Firebase/API authentication
    // On success, navigate to the correct dashboard
    console.log(`Attempting ${mode} for ${role} with email: ${email}`);
    // navigation.replace('FarmerDashboard'); // Example navigation
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome, {role}!</Text>
      <SegmentedButtons
        value={mode}
        onValueChange={setMode}
        buttons={[
          { value: 'login', label: 'Login' },
          { value: 'register', label: 'Register' },
        ]}
        style={{ marginBottom: 20 }}
      />

      {mode === 'register' && (
        <TextInput
          label={role === 'Farmer' ? 'Farm Name' : 'Full Name'}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      )}
      <TextInput
        label="Email / Phone"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAuth} style={styles.button}>
        {mode === 'login' ? 'Login' : 'Create Account'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});