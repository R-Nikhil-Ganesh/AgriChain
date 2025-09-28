import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function AggregatorHomeScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t('aggregatorDashboard')}</Title>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleLarge">{t('scanVerifyProduce')}</Text>
          <Text style={styles.subText}>{t('scanQRCodeInstructions')}</Text>
          <Button
            icon="qrcode-scan"
            mode="contained"
            onPress={() => navigation.navigate('QR Scan')}
            style={styles.button}
          >
            {t('scanFarmerQRCode')}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, justifyContent: 'center' },
  title: { position: 'absolute', top: 30, alignSelf: 'center', fontSize: 24 },
  card: { marginHorizontal: 10 },
  cardContent: { alignItems: 'center' },
  subText: { textAlign: 'center', marginVertical: 10 },
  button: { marginTop: 15, width: '90%' },
});
