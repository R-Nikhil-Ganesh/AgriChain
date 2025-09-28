import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function RetailerHomeScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t('retailerDashboard')}</Title>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleLarge">{t('verifyIncomingStock')}</Text>
          <Text style={styles.subText}>{t('scanQRFromTransporterText')}</Text>
          <Button
            icon="qrcode-scan"
            mode="contained"
            onPress={() => navigation.navigate('QR Scan')}
            style={styles.button}
          >
            {t('scanQRFromTransporter')}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{t('manageInventory')}</Text>
          <Button
            onPress={() => navigation.navigate('Inventory')}
            style={styles.button}
          >
            {t('viewStoreInventory')}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, justifyContent: 'center' },
  title: { position: 'absolute', top: 30, alignSelf: 'center', fontSize: 24 },
  card: { marginHorizontal: 10, marginBottom: 20 },
  cardContent: { alignItems: 'center' },
  subText: { textAlign: 'center', marginVertical: 10 },
  button: { marginTop: 15, width: '90%', alignSelf: 'center' },
});
