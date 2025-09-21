import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Button } from 'react-native-paper';

const MOCK_INVENTORY = [
  { id: 'I1', item: 'Organic Tomatoes', quantity: '50kg', origin: 'Sunnyside Acres' },
  { id: 'I2', item: 'Whole Wheat Flour', quantity: '200kg', origin: 'John\'s Farm' },
];

export default function RetailerInventoryScreen() {
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.item}
        subtitle={`Origin: ${item.origin}`}
        left={(props) => <Avatar.Icon {...props} icon="package-variant-closed" />}
      />
       <Card.Content>
        <Text>Stock Quantity: {item.quantity}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => console.log('Update Packaging')}>Update Info</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <FlatList
      data={MOCK_INVENTORY}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>Store Inventory</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 15 },
});