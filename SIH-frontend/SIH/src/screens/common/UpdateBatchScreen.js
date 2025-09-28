import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Title, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
// import { updateBatchStatus } from '../../api/hyperledger'; // Uncomment when API exists

export default function UpdateBatchScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { batchId, userRole } = route.params;

  const [updateInfo, setUpdateInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const getLabel = () => {
    switch (userRole) {
      case 'Aggregator':
        return t('aggregatorUpdateLabel');
      case 'Transporter':
        return t('transporterUpdateLabel');
      case 'Retailer':
        return t('retailerUpdateLabel');
      default:
        return t('defaultUpdateLabel');
    }
  };

  const handleUpdate = async () => {
    if (!updateInfo) {
      Alert.alert(t('error'), t('enterUpdateInfo'));
      return;
    }
    setLoading(true);
    try {
      // await updateBatchStatus(batchId, { status: `${userRole} Update`, metadata: updateInfo });
      console.log(`Updating batch ${batchId} with info: ${updateInfo}`);
      Alert.alert(t('success'), t('updateSuccess'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('updateFailed'), t('updateFailedMessage'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t('updateBatchTitle', { batchId })}</Title>
      <Text style={styles.subtitle}>{t('yourRole', { role: userRole })}</Text>
      <TextInput
        label={getLabel()}
        value={updateInfo}
        onChangeText={setUpdateInfo}
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {t('submitUpdate')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 20 },
  button: { paddingVertical: 5 },
});
