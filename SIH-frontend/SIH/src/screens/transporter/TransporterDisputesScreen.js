import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, Card, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const MOCK_DISPUTES = [
  {id: 'D1', batchId: 'BATCH_POTATO_012', reason: 'Incorrect weight', status: 'Pending Review', date: '2025-09-20', raisedBy: 'Central Mandi'},
  {id: 'D2', batchId: 'BATCH_WHEAT_001', reason: 'Packaging damaged', status: 'Resolved', date: '2025-09-18', raisedBy: 'Fresh Mart'},
];

export default function TransporterDisputesScreen({ navigation }) {
  const { t } = useTranslation();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DisputeDetails', { dispute: item })}>
      <Card style={styles.card}>
        <Card.Title 
          title={`${t('batch')}: ${item.batchId}`} 
          subtitle={`${t('reason')}: ${item.reason}`} 
        />
        <Card.Content>
           <Chip icon="alert-circle">{t(item.status.replace(/\s+/g, ''))}</Chip>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
       <Button
        icon="plus-circle"
        mode="contained"
        onPress={() => console.log('Navigate to new dispute form')}
        style={styles.button}
      >
        {t('raiseDispute')}
      </Button>
      <FlatList
        data={MOCK_DISPUTES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>{t('disputeHistory')}</Text>}
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
