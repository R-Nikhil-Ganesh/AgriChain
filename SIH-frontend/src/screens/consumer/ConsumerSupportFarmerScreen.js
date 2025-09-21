import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text, TextInput, Title } from 'react-native-paper';

// This data would normally come from a scanned product
const MOCK_FARMER_INFO = {
  name: 'John Doe',
  farm: 'John\'s Farm',
  crop: 'Whole Wheat',
  bio: 'Dedicated to organic farming for over 20 years, providing healthy and sustainable produce for the community.'
};

export default function ConsumerSupportFarmerScreen({ navigation }) {
    const [tipAmount, setTipAmount] = React.useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.header}>Support the Farmer</Title>
      <Card style={styles.card}>
        <Card.Title
          title={MOCK_FARMER_INFO.name}
          subtitle={MOCK_FARMER_INFO.farm}
          left={(props) => <Avatar.Icon {...props} icon="leaf" />}
        />
        <Card.Content>
          <Text style={styles.bio}>{MOCK_FARMER_INFO.bio}</Text>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
          <Card.Content>
              <Text variant="titleLarge" style={styles.actionTitle}>Tip Farmer</Text>
              <TextInput 
                label="Amount (ETH)"
                value={tipAmount}
                onChangeText={setTipAmount}
                keyboardType="numeric"
                style={{marginBottom: 10}}
              />
              <Button mode="contained" icon="gift" onPress={() => console.log(`Tipping ${tipAmount} ETH`)}>
                Send Tip
              </Button>
          </Card.Content>
      </Card>
      
      <Card style={styles.card}>
          <Card.Content>
              <Text variant="titleLarge" style={styles.actionTitle}>Subscribe to Produce</Text>
              <Text>Get a weekly or monthly delivery directly from the farm.</Text>
              <Button style={{marginTop: 10}} mode="outlined" icon="calendar" onPress={() => console.log('Subscribe')}>
                View Subscription Options
              </Button>
          </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { marginBottom: 10, textAlign: 'center' },
  card: { marginBottom: 20 },
  bio: { fontStyle: 'italic', marginTop: 5 },
  actionTitle: { marginBottom: 15 },
});