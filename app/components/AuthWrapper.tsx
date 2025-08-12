import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function AuthWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (isMounted) {
          if (token) {
            router.replace('/root_home/home'); // Skip login entirely
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error reading token', error);
        setLoading(false);
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
