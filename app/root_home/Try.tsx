import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';

export default function Try() {
  const route = useRoute();
  const { product } = route.params;

  const [userImage, setUserImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is needed!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setUserImage(result.assets[0].uri);
    }
  };

  const handleTryOn = () => {
    if (!userImage) {
      Alert.alert('Upload Required', 'Please upload your image first.');
      return;
    }

    // Simulate try-on logic
    Alert.alert('Processing', 'Virtual try-on feature coming soon...');
    
    // Simulate output image after processing
    setOutputImage(userImage); // Replace this with actual AI-processed image in future
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Virtual Try-On</Text>

      {/* Product Image */}
      <Image
        source={{ uri: `http://10.0.0.6:5000${product.imageUrl}` }}
        style={styles.dressImage}
      />

      {/* Upload User Image */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Upload Your Image</Text>
      </TouchableOpacity>

      {/* User Image Display */}
      {userImage && (
        <Image source={{ uri: userImage }} style={styles.userImage} />
      )}

      {/* Try Button */}
      <TouchableOpacity style={styles.tryButton} onPress={handleTryOn}>
        <Text style={styles.tryButtonText}>Try Now</Text>
      </TouchableOpacity>

      {/* Output Image Display */}
      {outputImage && (
        <View style={styles.outputContainer}>
          <Text style={styles.outputText}>Output Image:</Text>
          <Image source={{ uri: outputImage }} style={styles.outputImage} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dressImage: {
    width: 250,
    height: 350,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  userImage: {
    width: 250,
    height: 350,
    borderRadius: 12,
    resizeMode: 'contain',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  tryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outputContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  outputText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  outputImage: {
    width: 250,
    height: 350,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#999',
  },
});
