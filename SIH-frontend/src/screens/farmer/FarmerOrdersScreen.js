import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';

const MOCK_ORDERS = [
  { id: 'ORD_1', from: 'Central Mandi', crop: 'Wheat (500kg)', status: 'Pending' },
  { id: 'ORD_2', from: 'Fresh Veggies Co.', crop: 'Tomatoes (50kg)', status: 'Pending' },
];

export default function FarmerOrdersScreen() {
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.from}
        subtitle={item.crop}
        left={(props) => <Avatar.Icon {...props} icon="store" />}
      />
      <Card.Actions>
        <Button onPress={() => console.log('Accept')}>Accept</Button>
        <Button onPress={() => console.log('Reject')}>Reject</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <FlatList
      data={MOCK_ORDERS}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>Incoming Orders</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 15 },
});