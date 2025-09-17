import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import { useApi } from '../context/ApiContext';

export default function Try() {
  const APP_BASE = useApi();
  const route = useRoute();
  const { product } = route.params;

  const [userImage, setUserImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

    if (!result.canceled && result.assets.length > 0) {
      setUserImage(result.assets[0].uri);
    }
  };

  const handleTryOn = async () => {
    if (!userImage) {
      return Alert.alert('Upload Required', 'Please upload your image first.');
    }

    try {
      setLoading(true);
      const formData = new FormData();

      // Append model image (user image)
      formData.append('model', {
        uri: userImage,
        name: 'user.jpg',
        type: 'image/jpeg',
      } as any);

      // Fetch the cloth image as a blob
      const clothResponse = await fetch(`${APP_BASE}${product.imageUrl}`);
      const clothBlob = await clothResponse.blob();

      // Create a new File object for cloth image
      const clothFile: any = {
        uri: `${APP_BASE}${product.imageUrl}`,
        name: 'cloth.jpg',
        type: clothBlob.type || 'image/jpeg',
      };

      formData.append('cloth', clothFile);

      // Send to Node.js backend
      const response = await fetch(`${APP_BASE}/api/tryon`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) throw new Error('Try-on failed');

      const { result } = await response.json();

      setOutputImage(`data:image/jpeg;base64,${result}`);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Virtual Try-On</Text>

      <Image
        source={{ uri: `${APP_BASE}${product.imageUrl}` }}
        style={styles.dressImage}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Upload Your Image</Text>
      </TouchableOpacity>

      {userImage && (
        <Image source={{ uri: userImage }} style={styles.userImage} />
      )}

      <TouchableOpacity style={styles.tryButton} onPress={handleTryOn}>
        <Text style={styles.tryButtonText}>
          {loading ? 'Processing...' : 'Try Now'}
        </Text>
      </TouchableOpacity>

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
