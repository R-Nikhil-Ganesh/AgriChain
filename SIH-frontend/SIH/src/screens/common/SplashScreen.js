import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export default function SplashScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}>
      <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>🌱 AgriChain</Text>
      <Text variant="titleMedium" style={{ marginBottom: 20 }}>Transparent Food Journey – From Farm to Plate</Text>
      <ActivityIndicator animating={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});