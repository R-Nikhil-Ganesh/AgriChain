import React, { useContext } from 'react'; // 1. Import useContext
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text, Title, List } from 'react-native-paper';
import { AuthContext } from '../../store/AuthContext'; // 2. Import AuthContext

export default function ProfileScreen({ navigation }) {
  // 3. Get the signOut function from our context
  const { signOut, userRole } = useContext(AuthContext);

  // In a real app, user data would come from context or props
  const user = { name: 'John Doe', role: userRole, email: 'john.d@farm.com' };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Icon size={80} icon="account" />
          <Title style={styles.name}>{user.name}</Title>
          <Text>{user.role}</Text>
        </Card.Content>
      </Card>

      <List.Section style={{marginTop: 20}}>
        <List.Subheader>Account Information</List.Subheader>
        <List.Item
          title="Email"
          description={user.email}
          left={() => <List.Icon icon="email" />}
        />
        <List.Item
          title="Wallet Balance"
          description="0.45 ETH" // Placeholder
          left={() => <List.Icon icon="wallet" />}
        />
        <List.Item
          title="Edit Profile"
          left={() => <List.Icon icon="pencil" />}
          onPress={() => console.log('Navigate to Edit Profile')}
        />
      </List.Section>

      <Button
        mode="contained"
        onPress={signOut} // 4. Call the actual signOut function
        style={styles.logoutButton}
        icon="logout"
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  profileHeader: { alignItems: 'center', paddingVertical: 20 },
  name: { marginTop: 15 },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    left: 15,
    right: 15,
  },
});