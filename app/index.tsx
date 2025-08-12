import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthWrapper from './components/AuthWrapper';

export default function Home() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/bgImage.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <Text style={styles.heading}>Style Your Way</Text>

          {/* Login Button */}
          <View style={styles.buttonWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed ? styles.whiteButton : styles.redButton,
              ]}
              onPress={() => router.push('/login')}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.buttonText,
                    pressed ? styles.redText : styles.whiteText,
                  ]}
                >
                  Login
                </Text>
              )}
            </Pressable>
          </View>

          {/* Signup Button */}
          <View style={styles.buttonWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed ? styles.redButton : styles.whiteButton,
              ]}
              onPress={() => router.push('/signup')}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.buttonText,
                    pressed ? styles.whiteText : styles.redText,
                  ]}
                >
                  Signup
                </Text>
              )}
            </Pressable>
          </View>

          {/* Sign up with Google */}
          <View style={styles.buttonWrapper}>
            <Pressable
              style={styles.googleButton}
              onPress={() => console.log('Google Sign In')}
            >
              <Image
                source={require('../assets/images/google.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.googleText}>Signup with Google</Text>
            </Pressable>
          </View>

          {/* Sign up with Facebook */}
          <View style={styles.buttonWrapper}>
            <Pressable
              style={styles.facebookButton}
              onPress={() => console.log('Facebook Sign In')}
            >
              <Text style={styles.facebookText}>Signup with Facebook</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  overlay: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  backgroundColor: 'rgba(0,0,0,0.4)',
},
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 9,
    alignItems: 'center',
    borderWidth: 2,
    width: '100%',
  },
  redButton: {
    backgroundColor: '#db3022',
  },
  whiteButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  whiteText: {
    color: '#fff',
  },
  redText: {
    color: '#db3022',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
  },
  googleText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderRadius: 9,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  facebookText: {
    fontSize: 18,
    color: '#fff',
  },
  icon: {
    width: 20,
    height: 20,
  },
});