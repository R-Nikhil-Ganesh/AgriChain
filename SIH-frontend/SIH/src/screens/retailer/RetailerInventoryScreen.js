import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const MOCK_INVENTORY = [
  { id: 'I1', item: 'Organic Tomatoes', quantity: '50kg', origin: 'Sunnyside Acres' },
  { id: 'I2', item: 'Whole Wheat Flour', quantity: '200kg', origin: "John's Farm" },
];

export default function RetailerInventoryScreen() {
  const { t } = useTranslation();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.item}
        subtitle={`${t('origin')}: ${item.origin}`}
        left={(props) => <Avatar.Icon {...props} icon="package-variant-closed" />}
      />
      <Card.Content>
        <Text>{t('stockQuantity')}: {item.quantity}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => console.log('Update Packaging')}>{t('updateInfo')}</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <FlatList
      data={MOCK_INVENTORY}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>{t('storeInventory')}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 15 },
});
