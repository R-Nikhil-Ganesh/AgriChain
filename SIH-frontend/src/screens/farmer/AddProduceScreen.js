import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';

export default function AddProduceScreen({ navigation }) {
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleAddProduce = () => {
    // TODO: Call API to add produce to the blockchain
    console.log({ cropName, quantity, price });
    // Go back to the home screen after adding
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Add New Produce Batch</Title>
      <TextInput
        label="Crop Name (e.g., Wheat)"
        value={cropName}
        onChangeText={setCropName}
        style={styles.input}
      />
      <TextInput
        label="Quantity (e.g., 500kg)"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
      />
      <TextInput
        label="Price per unit"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddProduce} style={styles.button}>
        Generate Batch on Blockchain
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingVertical: 5 },
});