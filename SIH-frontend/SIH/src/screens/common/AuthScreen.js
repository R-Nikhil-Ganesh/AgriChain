// screens/common/AuthScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Button, TextInput, Text, SegmentedButtons } from 'react-native-paper';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../../firebaseConfig';
import { useAuth } from '../../store/AuthContext';
import { useTranslation } from 'react-i18next'; // <-- import i18n

// Object to hold the background images for each role
const backgroundImages = {
  Farmer: { uri: 'https://eatrevolutionindia.com/wp-content/uploads/2025/05/farmers-empowerment.jpg' },
  Aggregator: { uri: 'https://inc42.com/wp-content/uploads/2019/11/autonxt-facebook-1.jpg' },
  Transporter: { uri: 'https://www.g3enterprises.com/content/dam/g3/insights/blog/ag-logistics/agricultural-transport-g3enterprises.png/jcr:content/renditions/custom_webp_rendition.webp' },
  Retailer: { uri: 'https://images.pexels.com/photos/5807481/pexels-photo-5807481.jpeg' },
  Consumer: { uri: 'https://miro.medium.com/v2/resize:fit:1400/1*br4WoPW0R9p6Qzbg43542g.jpeg' },
  default: { uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=2070&auto=format&fit=crop' }
};


export default function AuthScreen({ route }) {
  const { role } = route.params;
  const { signIn } = useAuth();
  const { t } = useTranslation(); // <-- use translation hook

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Select the background image based on the role, or use the default
  const backgroundImage = backgroundImages[role] || backgroundImages.default;

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('errorFillEmailPassword'));
      return;
    }
    setLoading(true);
    setError('');

    try {
      await signIn(email, password, role);
    } catch (err) {
      if (err.message === 'Invalid credentials for this role.') {
        setError(t('errorInvalidRole'));
      } else {
        setError(t('errorInvalidEmailPassword'));
      }
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError(t('errorFillAllFields'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: role,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          {t('welcomeRole', { role })}
        </Text>

        <SegmentedButtons
          value={mode}
          onValueChange={(value) => {
            setMode(value);
            setError('');
          }}
          buttons={[
            { value: 'login', label: t('login') },
            { value: 'register', label: t('register') },
          ]}
          style={{ marginBottom: 20 }}
        />

        {mode === 'register' && (
          <TextInput
            label={role === 'Farmer' ? t('farmName') : t('fullName')}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        )}

        <TextInput
          label={t('email')}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label={t('password')}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={mode === 'login' ? handleLogin : handleRegister}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          {mode === 'login' ? t('login') : t('createAccount')}
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: 20,
    padding: 20,
    // Apply glassmorphism effect
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // More transparent background
    borderRadius: 15, // Slightly more rounded corners
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Light border for the glass edge
    overflow: 'hidden', // Ensures content stays within the rounded corners
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff', // Changed text to white for better contrast
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent input fields
  },
  button: {
    marginTop: 10,
    paddingVertical: 5
  },
  errorText: {
    color: 'yellow', // Changed error text to yellow for visibility on dark backgrounds
    textAlign: 'center',
    marginBottom: 10,
  },
});
