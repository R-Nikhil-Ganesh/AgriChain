import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { ActivityIndicator, Card, Text, Title, List, Divider, useTheme } from 'react-native-paper';
import { getBatchHistory } from '../../api/hyperledger';

export default function BatchDetailsScreen({ route }) {
  const { batchId } = route.params;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await getBatchHistory(batchId);
        if (!response || !response.history) {
          setHistory([]);
          setError('No history found for this batch.');
          return;
        }

        // Chronological order: oldest first
        setHistory(response.history.slice().reverse());
        setError('');
      } catch (err) {
        console.error('Failed to fetch batch history:', err);
        setError('Failed to fetch batch history. The batch may not exist or the network is down.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [batchId]);

  const renderHistoryItem = ({ item }) => {
    const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
    const status = item.record?.currentStatus || 'Unknown';
    let icon = 'history';

    switch (status) {
      case 'Harvested':
        icon = 'leaf';
        break;
      case 'In-Transit':
        icon = 'truck-delivery';
        break;
      case 'In-Store':
        icon = 'store';
        break;
    }

    return (
      <View>
        <List.Item
          title={status}
          description={`Owner: ${item.record?.currentOwner || 'N/A'}\nTimestamp: ${timestamp}\nTxID: ${item.txId?.substring(0, 16) || 'N/A'}...`}
          descriptionNumberOfLines={4}
          left={props => <List.Icon {...props} icon={icon} color={theme.colors.primary} />}
        />
        <Divider />
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator animating size="large" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;

  const latest = history[history.length - 1]?.record;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Produce Journey for Batch:</Title>
          <Text variant="headlineSmall" style={styles.batchId}>{batchId}</Text>
          {latest && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.detail}><Text style={styles.bold}>Crop:</Text> {latest.cropType}</Text>
              <Text style={styles.detail}><Text style={styles.bold}>Farmer:</Text> {latest.farmerName}</Text>
              <Text style={styles.detail}><Text style={styles.bold}>Origin:</Text> {latest.farmLocation}</Text>
              <Text style={styles.detail}><Text style={styles.bold}>Quantity:</Text> {latest.quantity} {latest.unit}</Text>
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Transaction History</Title>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.txId || Math.random().toString()}
            ListEmptyComponent={<Text>No transaction history found.</Text>}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { textAlign: 'center' },
  batchId: { textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  card: { marginVertical: 8 },
  errorText: { textAlign: 'center', color: 'red' },
  divider: { marginVertical: 10 },
  detail: { fontSize: 16, marginBottom: 4 },
  bold: { fontWeight: 'bold' },
});
