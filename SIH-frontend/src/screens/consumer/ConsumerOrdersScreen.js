import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Button } from 'react-native-paper';

const MOCK_PURCHASES = [
  { id: 'P1', item: 'Organic Tomatoes', from: 'Green Retail', date: '2025-09-16' },
  { id: 'P2', item: 'Whole Wheat Flour', from: 'Green Retail', date: '2025-09-15' },
];

export default function ConsumerOrdersScreen() {
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.item}
        subtitle={`Purchased from ${item.from} on ${item.date}`}
        left={(props) => <Avatar.Icon {...props} icon="basket" />}
      />
      <Card.Actions>
        <Button onPress={() => console.log('View Journey')}>View Journey</Button>
        <Button onPress={() => console.log('Raise Dispute')}>Raise Dispute</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <FlatList
      data={MOCK_PURCHASES}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>My Purchases</Text>}
    />
  );
}
const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 15 },
});