import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Card, Text, Title, ActivityIndicator, Avatar } from 'react-native-paper';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { fetchWeather } from '../../api/weather';

export default function FarmerHomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permissionDeniedTitle'), t('permissionDeniedMessage'));
        setLoadingWeather(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const weatherData = await fetchWeather(latitude, longitude);
        setWeather(weatherData);
      } catch (error) {
        Alert.alert(t('error'), t('fetchWeatherError'));
      } finally {
        setLoadingWeather(false);
      }
    };

    loadWeather();
  }, [t]);

  const newOrderCount = 3; // Example count

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t('farmerDashboard')}</Title>

      <Card style={styles.card}>
        <Card.Title
          title={t('currentWeather')}
          subtitle={weather ? weather.name : t('loadingLocation')}
          left={(props) => <Avatar.Icon {...props} icon="weather-cloudy" />}
        />
        <Card.Content>
          {loadingWeather ? (
            <ActivityIndicator animating={true} />
          ) : weather ? (
            <View>
              <Text variant="headlineLarge">{weather.main.temp}°C</Text>
              <Text variant="titleMedium">{weather.weather[0].description}</Text>
              <Text>{`${t('humidity')}: ${weather.main.humidity}%`}</Text>
              <Text>{`${t('windSpeed')}: ${weather.wind.speed} m/s`}</Text>
            </View>
          ) : (
            <Text>{t('weatherUnavailable')}</Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{t('manageProduce')}</Text>
          <Button
            icon="plus-circle"
            mode="contained"
            onPress={() => navigation.navigate('AddProduce')}
            style={styles.button}
          >
            {t('addNewProduce')}
          </Button>
          <Button
            icon="qrcode"
            mode="outlined"
            onPress={() => navigation.jumpTo('QR Codes')}
            style={styles.button}
          >
            {t('viewGeneratedQRCodes')}
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{t('incomingOrders')}</Text>
          <Text>{t('newOrdersMessage', { count: newOrderCount })}</Text>
          <Button
            onPress={() => navigation.jumpTo('Orders')}
            style={styles.button}
          >
            {t('viewOrders')}
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