import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text, Title, List } from 'react-native-paper';
import { AuthContext } from '../../store/AuthContext';
import { useTranslation } from 'react-i18next'; // Added for translations

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation(); // Initialize translation
  const { signOut, userRole } = useContext(AuthContext);

  // In a real app, user data would come from context or props
  const user = { name: 'John Doe', role: userRole, email: 'john.d@farm.com' };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Icon size={80} icon="account" />
          <Title style={styles.name}>{user.name}</Title>
          <Text>{t(user.role.toLowerCase())}</Text> {/* translate role */}
        </Card.Content>
      </Card>

      <List.Section style={{ marginTop: 20 }}>
        <List.Subheader>{t('accountInformation')}</List.Subheader>
        <List.Item
          title={t('email')}
          description={user.email}
          left={() => <List.Icon icon="email" />}
        />
        <List.Item
          title={t('walletBalance')}
          description="₹1,00,000/-" // Placeholder
          left={() => <List.Icon icon="wallet" />}
        />
        <List.Item
          title={t('editProfile')}
          left={() => <List.Icon icon="pencil" />}
          onPress={() => console.log('Navigate to Edit Profile')}
        />
      </List.Section>

      <Button
        mode="contained"
        onPress={signOut}
        style={styles.logoutButton}
        icon="logout"
      >
        {t('logout')}
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
