import React from 'react';
import { FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const MOCK_ORDERS = [
  { id: 'ORD_1', from: 'Central Mandi', crop: 'Wheat (500kg)', status: 'Pending' },
  { id: 'ORD_2', from: 'Fresh Veggies Co.', crop: 'Tomatoes (50kg)', status: 'Pending' },
];

export default function FarmerOrdersScreen() {
  const { t } = useTranslation();

  const handleAccept = (item) => {
    Alert.alert(t('orderAccepted'), t('acceptedOrderMessage', { crop: item.crop, from: item.from }));
  };

  const handleReject = (item) => {
    Alert.alert(t('orderRejected'), t('rejectedOrderMessage', { crop: item.crop }));
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.from}
        subtitle={item.crop}
        left={(props) => <Avatar.Icon {...props} icon="store" />}
      />
      <Card.Actions>
        <Button onPress={() => handleAccept(item)}>{t('accept')}</Button>
        <Button onPress={() => handleReject(item)}>{t('reject')}</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <FlatList
      data={MOCK_ORDERS}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>{t('incomingOrders')}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 15 },
});