import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';

export default function FarmerHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Farmer Dashboard</Title>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Manage Your Produce</Text>
          <Button
            icon="plus-circle"
            mode="contained"
            onPress={() => navigation.navigate('AddProduce')}
            style={styles.button}
          >
            Add New Produce
          </Button>
          <Button
            icon="qrcode"
            mode="outlined"
            onPress={() => navigation.navigate('QR Codes')}
            style={styles.button}
          >
            View Generated QR Codes
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Incoming Orders</Text>
          <Text>You have 3 new orders from aggregators.</Text>
          <Button
            onPress={() => navigation.navigate('Orders')}
            style={styles.button}
          >
            View Orders
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  card: { marginBottom: 20 },
  button: { marginTop: 15 },
}); 