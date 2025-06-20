import React from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

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
          <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
            <View style={styles.overlay}>
              <Text style={styles.heading}>Login</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="abc@gmail.com"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="********"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed ? styles.whiteButton : styles.redButton,
                ]}
                onPress={() => console.log('Logging in...')}
              >
                <Text
                  style={({ pressed }) => [
                    styles.buttonText,
                    pressed ? styles.redText : styles.whiteText,
                  ]}
                >
                  Login
                </Text>
              </Pressable>

              <Pressable onPress={() => router.push('/signup')}>
                <Text style={styles.toggleText}>
                  Don't have an account? <Text style={styles.toggleLink}>Signup</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
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
    flex: 1,
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
