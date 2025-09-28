import React, { useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Text, Button, ActivityIndicator, Banner } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from 'react-i18next';
import { getMyBatches } from '../../api/hyperledger';

export default function FarmerQRCodesScreen({ navigation }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);

  const fetchBatches = async () => {
    try {
      setError(null);
      const fetchedBatches = await getMyBatches();
      setBatches(fetchedBatches);
    } catch (err) {
      setError(t('loadBatchesError'));
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchBatches();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBatches();
  }, []);

  const handleViewDetails = (batchId) => {
    navigation.navigate('BatchDetails', { batchId: batchId });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleViewDetails(item.ID)}>
        <Card style={styles.card}>
          <Card.Title title={item.cropType} subtitle={t('quantityLabel', { quantity: item.quantity, unit: item.unit })} />
          <Card.Content style={styles.content}>
            <View>
              <Text>{t('batchIdLabel', { id: item.ID })}</Text>
              <Text>{t('statusLabel', { status: item.currentStatus })}</Text>
            </View>
            <QRCode value={item.ID} size={100} />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return <View style={styles.center}><ActivityIndicator animating={true} size="large" /></View>;
  }

  return (
    <View style={{flex: 1}}>
        <Banner
            visible={!!error}
            actions={[{label: t('ok'), onPress: () => setError(null)}]}>
            {error}
        </Banner>
        <FlatList
            data={batches}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID}
            contentContainerStyle={styles.container}
            ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>{t('myProduceBatches')}</Text>}
            ListEmptyComponent={<Text style={styles.center}>{t('noBatchesFound')}</Text>}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, flexGrow: 1 },
  header: { marginBottom: 10, textAlign: 'center'},
  card: { marginBottom: 15 },
  content: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 20 },
});