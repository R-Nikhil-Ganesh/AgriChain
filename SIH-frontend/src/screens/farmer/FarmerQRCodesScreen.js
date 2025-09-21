import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native'; // 1. Import TouchableOpacity
import { Card, Text, Button } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

// 2. Add the 'navigation' prop to the component
export default function FarmerQRCodesScreen({ navigation }) {

  const MOCK_BATCHES = [
    { id: 'BATCH_WHEAT_001', crop: 'Wheat', quantity: '500kg', date: '2025-09-15' },
    { id: 'BATCH_TOMATO_007', crop: 'Tomatoes', quantity: '120kg', date: '2025-09-16' },
  ];

  // This function will handle the navigation
  const handleViewDetails = (batchId) => {
    navigation.navigate('BatchDetails', { batchId: batchId });
  };

  const renderItem = ({ item }) => (
    // 3. Wrap the Card in a TouchableOpacity to make it tappable
    <TouchableOpacity onPress={() => handleViewDetails(item.id)}>
      <Card style={styles.card}>
        <Card.Title title={item.crop} subtitle={`Quantity: ${item.quantity}`} />
        <Card.Content style={styles.content}>
          <View>
            <Text>Batch ID: {item.id}</Text>
            <Text>Harvested: {item.date}</Text>
            <Button 
              icon="share-variant" 
              style={{marginTop: 10}} 
              onPress={() => console.log('Share QR')}
            >
              Share / Print
            </Button>
          </View>
          <QRCode value={item.id} size={100} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={MOCK_BATCHES}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text variant="headlineSmall" style={styles.header}>Generated QR Codes</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center'},
  card: { marginBottom: 15 },
  content: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});