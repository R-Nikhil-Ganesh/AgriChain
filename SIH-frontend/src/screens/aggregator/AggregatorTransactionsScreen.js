import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Chip } from 'react-native-paper';

const MOCK_TRANSACTIONS = [
  { id: 'T1', batchId: 'BATCH_WHEAT_001', from: 'John\'s Farm', status: 'Forwarded to Transporter', date: '2025-09-16' },
  { id: 'T2', batchId: 'BATCH_TOMATO_007', from: 'Sunnyside Acres', status: 'In Storage', date: '2025-09-16' },
  { id: 'T3', batchId: 'BATCH_POTATO_012', from: 'Green Valley', status: 'Received from Farmer', date: '2025-09-15' },
];

export default function AggregatorTransactionsScreen() {
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`Batch: ${item.batchId}`}
        subtitle={`From: ${item.from}`}
        left={(props) => <Avatar.Icon {...props} icon="receipt" />}
      />
      <Card.Content>
        <Chip icon="information" style={styles.chip}>{item.status}</Chip>
        <Text style={styles.dateText}>Date: {item.date}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={MOCK_TRANSACTIONS}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>Transaction History</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 15 },
  chip: { alignSelf: 'flex-start', marginBottom: 10 },
  dateText: { fontStyle: 'italic' },
});