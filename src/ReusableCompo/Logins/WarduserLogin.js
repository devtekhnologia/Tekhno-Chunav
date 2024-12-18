import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Vibration, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { WardUserContext } from '../../ContextApi/WardUserContext';

const { width, height } = Dimensions.get('window');
const API_URL = Constants.manifest?.extra?.apiUrl || 'http://192.168.1.38:8000';

export default function WarduserLogin({ navigation }) {
  const { language } = useContext(LanguageContext);
  const { login } = useContext(WardUserContext);
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validate = () => {
    let isValid = true;


    if (!contactNumber) {
      setContactNumberError('Contact number is required.');
      isValid = false;
    } else if (contactNumber.length < 10) {
      setContactNumberError('Contact number must be at least 10 digits.');
      isValid = false;
    } else {
      setContactNumberError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 5) {
      setPasswordError('Password must be at least 5 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        Vibration.vibrate(100);
        const response = await axios.post(`${API_URL}/api/prabhag_user_login/`, {
          prabhag_user_contact_number: contactNumber,
          prabhag_user_password: password,
        });
        if (response.status === 200) {
          login(response.data.token)
        }
      } catch (error) {
        Alert.alert('Error', 'Invalid contact number or password.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <LinearGradient
      colors={['#3C4CAC', '#F04393']}
      locations={[0, 0.45]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/tekhnoWhite.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeading}>
          {language === 'en' ? 'Log In' : 'लॉग इन करा'}
        </Text>

        <Text style={styles.label}>
          {language === 'en' ? 'Contact Number' : 'संपर्क  नंबर'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={language === 'en' ? "Enter contact number here ..." : 'येथे संपर्क क्रमांक प्रविष्ट करा...'}
          placeholderTextColor="#666"
          value={contactNumber}
          onChangeText={setContactNumber}
          maxLength={10}
          keyboardType="phone-pad"
        />
        {contactNumberError ? <Text style={styles.errorText}>{contactNumberError}</Text> : null}

        <Text style={styles.label}>
          {language === 'en' ? 'Password' : 'पासवर्ड'}
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={language === 'en' ? "Enter password here ..." : 'इथे पासवर्ड टाका...'}
            placeholderTextColor="#666"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>
            {language === 'en' ? 'Forgot Password?' : 'पासवर्ड विसरलात?'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>
            {language === 'en' ? 'Log In' : 'लॉग इन करा'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: height * 0.3 - (width * 0.25),
    left: width * 0.5 - (width * 0.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loginContainer: {
    width: width,
    height: height * 0.60,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: width * 0.1,
    justifyContent: 'flex-start',
  },
  loginHeading: {
    marginTop: '10%',
    fontSize: 28,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  input: {
    height: height * 0.06,
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: height * 0.06,
    borderRadius: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: height * 0.02,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#9095A1',
  },
  loginButton: {
    backgroundColor: '#F04393',
    borderRadius: 10,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
