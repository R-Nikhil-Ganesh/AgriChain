import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function QRScanScreen({ navigation }) {
  const { t } = useTranslation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    Alert.alert(
      t('scanSuccess'),
      t('batchIdPrompt', { batchId: data }),
      [
        {
          text: t('scanAgain'),
          onPress: () => setScanned(false),
          style: 'cancel',
        },
        {
          text: t('viewDetails'),
          onPress: () => {
            navigation.navigate('BatchDetails', { batchId: data });
            setTimeout(() => setScanned(false), 1000);
          },
        },
      ]
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>{t('requestingCamera')}</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>{t('noCameraAccess')}</Text>
        <Button onPress={() => Camera.requestCameraPermissionsAsync()}>{t('allowCamera')}</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>{t('pointCamera')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#fff', borderRadius: 10 },
  bottomTextContainer: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' },
  bottomText: { color: '#fff', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 5 },
});
