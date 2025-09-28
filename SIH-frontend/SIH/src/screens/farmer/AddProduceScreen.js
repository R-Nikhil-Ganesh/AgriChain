import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Title, ActivityIndicator, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../store/AuthContext';
import { createProduceBatch } from '../../api/hyperledger';

export default function AddProduceScreen({ navigation }) {
  const { t } = useTranslation();
  const { userToken } = useContext(AuthContext);
  const theme = useTheme();

  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [farmerName, setFarmerName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmID, setFarmID] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProduce = async () => {
    const cropType = String(cropName || '').trim();
    const qty = parseInt(String(quantity || '0').trim(), 10);
    // ... (rest of the validation logic is the same)

    if (!cropType) {
      Alert.alert(t('missingCropTitle'), t('missingCropMessage'));
      return;
    }
    if (!qty || qty <= 0) {
      Alert.alert(t('invalidQuantityTitle'), t('invalidQuantityMessage'));
      return;
    }
    if (!farmerName || !farmLocation || !farmID) {
      Alert.alert(t('missingInfoTitle'), t('missingInfoMessage'));
      return;
    }

    const batchData = {
      cropType,
      quantity: qty,
      unit,
      farmerName,
      farmLocation,
      farmID,
    };

    try {
      setLoading(true);
      const result = await createProduceBatch(batchData);
      if (result && result.success) {
        Alert.alert(t('success'), t('batchCreatedMessage', { assetID: result.assetID }));
        navigation.goBack();
      } else {
        throw new Error(result?.message || t('createFailedMessage'));
      }
    } catch (e) {
      console.error('Create error:', e);
      Alert.alert(t('error'), e.message || t('createFailedMessage'));
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t('addNewProduce')}</Title>

      <TextInput label={t('cropNameLabel')} value={cropName} onChangeText={setCropName} style={styles.input} />
      <TextInput label={t('farmerNameLabel')} value={farmerName} onChangeText={setFarmerName} style={styles.input} />
      <TextInput label={t('farmLocationLabel')} value={farmLocation} onChangeText={setFarmLocation} style={styles.input} />
      <TextInput label={t('farmIdLabel')} value={farmID} onChangeText={setFarmID} placeholder={t('farmIdPlaceholder')} style={styles.input} />

      <View style={styles.quantityContainer}>
        <TextInput label={t('quantity')} value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={styles.quantityInput} />
        <TextInput label={t('unitLabel')} value={unit} onChangeText={setUnit} style={styles.unitInput} />
      </View>

      {loading ? (
        <ActivityIndicator animating={true} size="large" style={{ marginTop: 20 }} />
      ) : (
        <Button mode="contained" onPress={handleAddProduce} style={styles.button}>
          {t('generateBatch')}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 15 },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantityInput: { flex: 2, marginRight: 10 },
  unitInput: { flex: 1 },
  button: { marginTop: 20, paddingVertical: 5 },
});