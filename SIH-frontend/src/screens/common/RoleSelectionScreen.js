import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const roles = [
  { title: 'Farmer', icon: 'leaf', role: 'Farmer' },
  { title: 'Aggregator', icon: 'home-group', role: 'Aggregator' },
  { title: 'Transporter', icon: 'truck', role: 'Transporter' },
  { title: 'Retailer', icon: 'store', role: 'Retailer' },
  { title: 'Consumer', icon: 'account-group', role: 'Consumer' },
];

export default function RoleSelectionScreen({ navigation }) {
  const handleSelectRole = (role) => {
    navigation.navigate('Auth', { role });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>Who are you?</Text>
      {roles.map((roleInfo) => (
        <Button
          key={roleInfo.role}
          icon={roleInfo.icon}
          mode="contained"
          onPress={() => handleSelectRole(roleInfo.role)}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {roleInfo.title}
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { textAlign: 'center', marginBottom: 30 },
  button: { marginVertical: 10 },
  buttonContent: { height: 50 },
});