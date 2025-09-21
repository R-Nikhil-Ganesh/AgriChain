import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card, Title } from 'react-native-paper';

export default function RetailerHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Retailer Dashboard</Title>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleLarge">Verify Incoming Stock</Text>
          <Text style={styles.subText}>Scan the QR code from the transporter to verify origin and purchase stock.</Text>
          <Button
            icon="qrcode-scan"
            mode="contained"
            onPress={() => navigation.navigate('QR Scan')}
            style={styles.button}
          >
            Scan QR from Transporter
          </Button>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Manage Inventory</Text>
           <Button
            onPress={() => navigation.navigate('Inventory')}
            style={styles.button}
          >
            View Store Inventory
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, justifyContent: 'center' },
  title: { position: 'absolute', top: 30, alignSelf: 'center', fontSize: 24 },
  card: { marginHorizontal: 10, marginBottom: 20 },
  cardContent: { alignItems: 'center' },
  subText: { textAlign: 'center', marginVertical: 10 },
  button: { marginTop: 15, width: '90%', alignSelf: 'center' },
});