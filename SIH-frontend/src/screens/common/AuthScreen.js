import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
// The native Alert is no longer needed for login errors
import { Button, TextInput, Text, SegmentedButtons } from 'react-native-paper';
import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AuthScreen({ route, navigation }) {
  const { role } = route.params;

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  // --- 1. NEW STATE TO HOLD THE ERROR MESSAGE ---
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role === role) {
        // Success: AuthContext listener handles navigation.
      } else {
        await auth.signOut();
        // --- 2. SET THE ERROR MESSAGE INSTEAD OF ALERTING ---
        setError('Invalid email or password.');
      }
    } catch (err) {
      // --- 2. SET THE ERROR MESSAGE INSTEAD OF ALERTING ---
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // ... (handleRegister function remains the same, it can still use Alert for now)
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
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(''); // Clear error when user starts typing
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(''); // Clear error when user starts typing
        }}
        secureTextEntry
        style={styles.input}
      />

      {/* --- 3. DISPLAY THE ERROR MESSAGE ON THE SCREEN --- */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={mode === 'login' ? handleLogin : handleRegister}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        {mode === 'login' ? 'Login' : 'Create Account'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingVertical: 5 },
  // --- STYLE FOR THE NEW ERROR TEXT ---
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});