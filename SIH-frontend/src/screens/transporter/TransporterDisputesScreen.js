import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text, Card, Chip } from 'react-native-paper';

const MOCK_DISPUTES = [
  {id: 'D1', batchId: 'BATCH_POTATO_012', reason: 'Incorrect weight', status: 'Pending Review'},
  {id: 'D2', batchId: 'BATCH_WHEAT_001', reason: 'Packaging damaged', status: 'Resolved'},
];

export default function TransporterDisputesScreen({ navigation }) {
    const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={`Batch: ${item.batchId}`} subtitle={`Reason: ${item.reason}`} />
      <Card.Content>
         <Chip icon="alert-circle">{item.status}</Chip>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
       <Button
        icon="plus-circle"
        mode="contained"
        onPress={() => console.log('Navigate to new dispute form')}
        style={styles.button}
      >
        Raise a New Dispute
      </Button>
      <FlatList
        data={MOCK_DISPUTES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>Dispute History</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { marginBottom: 10, textAlign: 'center', marginTop: 20 },
  card: { marginBottom: 15 },
  button: { marginBottom: 20 },
});