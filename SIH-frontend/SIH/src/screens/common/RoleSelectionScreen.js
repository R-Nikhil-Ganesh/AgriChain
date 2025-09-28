import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Button, Text, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../i18n';

const roles = [
  { titleKey: 'farmer', icon: 'leaf', role: 'Farmer' },
  { titleKey: 'aggregator', icon: 'home-group', role: 'Aggregator' },
  { titleKey: 'transporter', icon: 'truck', role: 'Transporter' },
  { titleKey: 'retailer', icon: 'store', role: 'Retailer' },
  { titleKey: 'consumer', icon: 'account-group', role: 'Consumer' },
];

const backgroundImage = { uri: 'https://media.istockphoto.com/id/187251869/photo/rice-crop.jpg?s=612x612&w=0&k=20&c=ATxHepv7IZ99NcNKkA7WyPsrsjorIubeV1uZbXboGag=' };

export default function RoleSelectionScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    const onLanguageChanged = (lng) => setCurrentLang(lng);
    i18n.on('languageChanged', onLanguageChanged);
    return () => i18n.off('languageChanged', onLanguageChanged);
  }, [i18n]);

  const handleSelectRole = (role) => {
    navigation.navigate('Auth', { role });
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'or' : 'en';
    changeAppLanguage(newLang);
    setCurrentLang(newLang);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text variant="headlineLarge" style={styles.title}>{t('whoAreYou')}</Text>
        
        {roles.map((roleInfo) => (
          <Button
            key={roleInfo.role}
            icon={roleInfo.icon}
            mode="contained"
            onPress={() => handleSelectRole(roleInfo.role)}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {t(roleInfo.titleKey)}
          </Button>
        ))}

        {/* Language Switch */}
        <View style={styles.switchRow}>
          <Text style={currentLang === 'en' ? styles.activeLang : styles.inactiveLang}>English</Text>
          <Switch value={currentLang === 'or'} onValueChange={toggleLanguage} />
          <Text style={currentLang === 'or' ? styles.activeLang : styles.inactiveLang}>ଓଡ଼ିଆ</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center', // This will center the overlay vertically
    paddingHorizontal: 20, // This will create space on the sides
  },
  overlay: {
    // We removed flex: 1 so it no longer takes up the whole screen
    justifyContent: 'center',
    padding: 25,
    backgroundColor: 'rgba(255,255,255,0.5)', // Made it more translucent
    borderRadius: 20, // Added rounded corners for a softer glass effect
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#135313ff', // Dark grass green
    fontSize: 36, // Slightly larger font size
  },
  button: { marginVertical: 10 },
  buttonContent: { height: 50 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  activeLang: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 10,
    color: '#1a202c',
  },
  inactiveLang: {
    fontWeight: 'normal',
    fontSize: 16,
    marginHorizontal: 10,
    opacity: 0.7,
    color: '#2d3748',
  },
});

