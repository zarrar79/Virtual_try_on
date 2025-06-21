import { useRouter } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// ... imports stay the same

export default function Login() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 800;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={[styles.container, isLargeScreen && styles.containerLarge]}>
          {/* Left Side: Form */}
          <View style={[styles.formContainer, isLargeScreen && styles.leftSide]}>
            <View style={styles.overlay}>
              <View style={styles.formWrapper}>
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
                    pressed ? styles.whiteButton : styles.greenButton,
                  ]}
                  onPress={() => console.log('Logging in...')}
                >
                  <Text style={styles.buttonText}>
                  
                    Login
                  </Text>
                </Pressable>

                <Pressable onPress={() => router.push('/auth/signup')}>
                  <Text style={styles.toggleText}>
                    Don't have an account? <Text style={styles.toggleLink}>Signup</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Right Side: Image */}
          {isLargeScreen && (
            <View style={styles.rightSide}>
              <Image
                source={require('../../assets/images/admin.jpg')}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
  },

  containerLarge: {
    flexDirection: 'row',
  },

  formContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  leftSide: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  formWrapper: {
    width : '70%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
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
    width: '100%',
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
    width: '100%',
    paddingVertical: 15,
    borderRadius: 9,
    marginVertical: 24,
    alignItems: 'center',
  },

  greenButton: {
    backgroundColor : '#22c55e'
  },

  whiteButton: {
    backgroundColor: '#fff',
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
    color: '#22c55e',
  },

  rightSide: {
    flex: 1,
  },

  image: {
    width: '100%',
    height: '100%',
  },
});



