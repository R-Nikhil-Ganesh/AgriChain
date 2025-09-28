import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const MOCK_TRANSACTIONS = [
  { id: 'T1', batchId: 'BATCH_WHEAT_001', from: 'John\'s Farm', status: 'Forwarded to Transporter', date: '2025-09-16' },
  { id: 'T2', batchId: 'BATCH_TOMATO_007', from: 'Sunnyside Acres', status: 'In Storage', date: '2025-09-16' },
  { id: 'T3', batchId: 'BATCH_POTATO_012', from: 'Green Valley', status: 'Received from Farmer', date: '2025-09-15' },
];

export default function AggregatorTransactionsScreen() {
  const { t } = useTranslation();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`${t('batch')}: ${item.batchId}`}
        subtitle={`${t('from')}: ${item.from}`}
        left={(props) => <Avatar.Icon {...props} icon="receipt" />}
      />
      <Card.Content>
        <Chip icon="information" style={styles.chip}>{t(item.status)}</Chip>
        <Text style={styles.dateText}>{t('date')}: {item.date}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={MOCK_TRANSACTIONS}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>{t('transactionHistory')}</Text>}
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
