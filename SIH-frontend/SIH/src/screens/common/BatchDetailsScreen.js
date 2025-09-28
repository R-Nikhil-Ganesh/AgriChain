import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Card, Text, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { getBatchHistory } from '../../api/hyperledger'; // Assuming this API function exists

export default function BatchDetailsScreen({ route }) {
  const { t } = useTranslation();
  const { batchId } = route.params;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getBatchHistory(batchId);
        setHistory(data);
        setError('');
      } catch (err) {
        setError(t('failedFetchBatch')); // translated error
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [batchId, t]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.header}>
        {t('journeyForBatch', { batchId })}
      </Title>
      {history ? (
        <Card>
          <Card.Content>
            <Text>{t('batchHistoryPlaceholder')}</Text>
          </Card.Content>
        </Card>
      ) : (
        <Text>{t('noHistoryFound')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 20, textAlign: 'center' },
});
