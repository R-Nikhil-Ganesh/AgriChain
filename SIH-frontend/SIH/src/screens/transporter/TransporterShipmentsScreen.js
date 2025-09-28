import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Button, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const MOCK_SHIPMENTS = [
  { id: 'S1', batchId: 'BATCH_WHEAT_001', from: 'Central Mandi', to: 'Green Retail', status: 'In Transit' },
  { id: 'S2', batchId: 'BATCH_TOMATO_007', from: 'Central Mandi', to: 'Fresh Mart', status: 'Picked Up' },
  { id: 'S3', batchId: 'BATCH_APPLE_003', from: 'Fruit Co-op', to: 'Super Grocers', status: 'Delivered' },
];

export default function TransporterShipmentsScreen() {
  const { t } = useTranslation();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`${t('batch')}: ${item.batchId}`}
        subtitle={`${item.from} → ${item.to}`}
        left={(props) => <Avatar.Icon {...props} icon="truck-delivery" />}
      />
       <Card.Content>
        <Chip icon="information" style={styles.chip}>{t(item.status.replace(/\s+/g, ''))}</Chip>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => console.log('Update Log')}>{t('addDeliveryLog')}</Button>
        <Button onPress={() => console.log('View Details')}>{t('details')}</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <FlatList
      data={MOCK_SHIPMENTS}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>{t('myShipments')}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 15 },
  chip: { alignSelf: 'flex-start', marginBottom: 5 },
});
