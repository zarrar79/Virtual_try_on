import { useRouter } from 'expo-router';
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

export default function Signup() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Left Side - Form */}
      <View style={styles.leftContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
              <View style={styles.formWrapper}>
                <Text style={styles.heading}>Signup</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput placeholder="John Doe" placeholderTextColor="#aaa" style={styles.input} />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    placeholder="john_39@gmail.com"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
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

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
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
                  onPress={() => console.log('Signing up...')}
                >
                  <Text
                    style={({ pressed }) => [
                      styles.buttonText,
                      pressed ? styles.redText : styles.whiteText,
                    ]}
                  >
                    Signup
                  </Text>
                </Pressable>

                <Pressable onPress={() => router.push('/auth')}>
                  <Text style={styles.toggleText}>
                    Already have an account? <Text style={styles.toggleLink}>Login</Text>
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>

      {/* Right Side - Image */}
      <View style={styles.rightContainer}>
        <Image
          source={require('../../assets/images/admin.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center', // center content horizontally
  },
  rightContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  keyboardAvoiding: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center', // center scroll content horizontally
    paddingHorizontal: 20,
  },
  formWrapper: {
    width : '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center', // center internal fields
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 14,
    width: '70%',
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#d6d6d6',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  button: {
    width: '70%',
    paddingVertical: 15,
    borderRadius: 9,
    marginVertical: 24,
    alignItems: 'center',
  },
  redButton: {
    backgroundColor: '#22c55e',
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
});
