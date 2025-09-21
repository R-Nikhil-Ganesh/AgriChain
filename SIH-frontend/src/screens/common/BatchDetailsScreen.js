import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Card, Text, Title } from 'react-native-paper';
import { getBatchHistory } from '../../api/hyperledger'; // Assuming this API function exists

export default function BatchDetailsScreen({ route }) {
  const { batchId } = route.params;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Call your API to get the data for the scanned batch ID
        const data = await getBatchHistory(batchId);
        setHistory(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch batch details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [batchId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator animating={true} size="large" /></View>;
  }

  if (error) {
    return <View style={styles.center}><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Journey for Batch: {batchId}</Title>
      {history ? (
         // In a real app, you would use a FlatList to render the journey timeline
        <Card>
          <Card.Content>
            <Text>Here you would display the full timeline of the product from the 'history' state variable.</Text>
          </Card.Content>
        </Card>
      ) : <Text>No history found for this batch.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 20, textAlign: 'center' },
});