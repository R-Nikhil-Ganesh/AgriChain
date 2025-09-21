import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card, Title } from 'react-native-paper';

export default function TransporterHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Transporter Dashboard</Title>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleLarge">Manage Shipments</Text>
          <Text style={styles.subText}>Scan a batch's QR code to begin transport or mark it as delivered.</Text>
          <Button
            icon="qrcode-scan"
            mode="contained"
            onPress={() => navigation.navigate('QR Scan')}
            style={styles.button}
          >
            Scan Batch QR Code
          </Button>
        </Card.Content>
      </Card>
       <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Active Shipments</Text>
          <Text>You have 2 active shipments in transit.</Text>
          <Button
            onPress={() => navigation.navigate('Shipments')}
            style={styles.button}
          >
            View Shipments
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