import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, Text } from 'react-native-paper';

export default function QRScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Effect to request camera permission when the component mounts
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  // This function is called when a QR code is successfully scanned
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true); // Prevents scanning the same code multiple times in a row
    
    // In a real app, you would now use this 'data' (the batchId)
    // to fetch information from your Hyperledger API.
    
    Alert.alert(
      'Scan Successful!',
      `Batch ID: ${data}\n\nDo you want to view the details?`,
      [
        {
          text: 'Scan Again',
          onPress: () => setScanned(false), // Reset the scanned state
          style: 'cancel',
        },
        {
          text: 'View Details',
          // Navigate to a new screen with the scanned data
          onPress: () => {
            navigation.navigate('BatchDetails', { batchId: data });
            // We reset the scanned state when leaving the screen
            // so the user can scan again if they come back.
            setTimeout(() => setScanned(false), 1000); 
          },
        },
      ]
    );
  };

  // Render different UI based on permission status
  if (hasPermission === null) {
    return <View style={styles.center}><Text>Requesting for camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return (
        <View style={styles.center}>
            <Text>No access to camera.</Text>
            <Button onPress={() => Camera.requestCameraPermissionsAsync()}>Allow Camera</Button>
        </View>
    );
  }

  // If permission is granted, show the camera view
  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* You can add an overlay here, like a targeting box */}
      <View style={styles.overlay}>
          <View style={styles.scanBox} />
      </View>

      <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Point your camera at a QR code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
});