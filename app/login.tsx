import { navigate } from 'expo-router/build/global-state/routing';

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both email and password fields');
      return;
    }
    console.log("home");
    
        router.push('/root_home/home');
  };

  return (
    <ImageBackground
      source={require('../assets/images/banner.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.overlay}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.heading}>Login</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="abc@gmail.com"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="********"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed ? styles.whiteButton : styles.redButton,
                ]}
                onPress={handleLogin}
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

              <Pressable onPress={() => router.push('/signup')}>
                <Text style={styles.toggleText}>
                  Don't have an account? <Text style={styles.toggleLink}>Signup</Text>
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 9,
    marginVertical: 24,
    width: '100%',
    alignItems: 'center',
  },
  redButton: {
    backgroundColor: '#db3022',
    borderColor: '#fff',
  },
  whiteButton: {
    backgroundColor: '#fff',
    borderColor: '#db3022',
  },
  buttonText: {
    fontSize: 18,
  },
  whiteText: {
    color: '#fff',
  },
  redText: {
    color: '#db3022',
  },
  toggleText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  toggleLink: {
    fontWeight: 'bold',
    color: '#db3022',
  },
});
