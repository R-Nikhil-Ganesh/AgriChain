import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card, Title } from 'react-native-paper';

export default function AggregatorHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Aggregator Dashboard</Title>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleLarge">Scan & Verify Produce</Text>
          <Text style={styles.subText}>Scan the QR code on the farmer's batch to add it to your inventory.</Text>
          <Button
            icon="qrcode-scan"
            mode="contained"
            onPress={() => navigation.navigate('QR Scan')}
            style={styles.button}
          >
            Scan Farmer QR Code
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, justifyContent: 'center' },
  title: { position: 'absolute', top: 30, alignSelf: 'center', fontSize: 24 },
  card: { marginHorizontal: 10 },
  cardContent: { alignItems: 'center' },
  subText: { textAlign: 'center', marginVertical: 10 },
  button: { marginTop: 15, width: '90%' },
});