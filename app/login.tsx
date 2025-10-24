import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Modal,
} from 'react-native';
import styles from './CSS/Login.styles';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useApi } from './context/ApiContext';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const BASE_URL = useApi();

  // 🔹 Forgot Password modal state
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    (async () => {
      if (await AsyncStorage.getItem('token')) {
        router.replace('/root_home/home');
        return;

      }
    })()
  }, [router])
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both email and password fields');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', data.user._id);
        await AsyncStorage.setItem('user_name', data.user.name);

        router.replace('/root_home/home');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error or server not reachable');
    }
  };

  // 🔹 Handle Forgot Password API call
  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.msg || 'Password reset link sent');
        setForgotVisible(false);
        setForgotEmail('');
      } else {
        Alert.alert('Error', data.msg || 'Unable to send reset link');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'Network error or server not reachable');
    }
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

              {/* 🔹 Forgot Password Button */}
              <Pressable onPress={() => setForgotVisible(true)}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>

              <Pressable onPress={() => router.push('/signup')}>
                <Text style={styles.toggleText}>
                  Don't have an account?{' '}
                  <Text style={styles.toggleLink}>Signup</Text>
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* 🔹 Forgot Password Modal */}
      <Modal visible={forgotVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={forgotEmail}
              onChangeText={setForgotEmail}
            />
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Pressable style={[styles.button, styles.redButton, { flex: 1, marginRight: 5 }]} onPress={handleForgotPassword}>
                <Text style={[styles.buttonText, styles.whiteText]}>Submit</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.whiteButton, { flex: 1, marginLeft: 5 }]} onPress={() => setForgotVisible(false)}>
                <Text style={[styles.buttonText, styles.redText]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}