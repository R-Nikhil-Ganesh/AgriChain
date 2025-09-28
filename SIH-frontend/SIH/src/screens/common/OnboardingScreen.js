import React, { useContext } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../store/AuthContext';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const { completeOnboarding } = useContext(AuthContext);
  const { t } = useTranslation();

  const slides = [
    { key: '1', title: t('onboardingSlide1Title'), text: t('onboardingSlide1Text') },
    { key: '2', title: t('onboardingSlide2Title'), text: t('onboardingSlide2Text') },
    { key: '3', title: t('onboardingSlide3Title'), text: t('onboardingSlide3Text') },
  ];

  const handleGetStarted = () => {
    completeOnboarding();
    navigation.replace('RoleSelection');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {slides.map(slide => (
          <View key={slide.key} style={styles.slide}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="headlineMedium" style={styles.title}>{slide.title}</Text>
                <Text variant="bodyLarge">{slide.text}</Text>
              </Card.Content>
            </Card>
          </View>
        ))}
      </ScrollView>
      <Button
        mode="contained"
        onPress={handleGetStarted} 
        style={styles.button}
      >
        {t('getStarted')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  slide: { width: width, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '90%' },
  title: { marginBottom: 16, textAlign: 'center' },
  button: { position: 'absolute', bottom: 50, width: '80%' },
});
