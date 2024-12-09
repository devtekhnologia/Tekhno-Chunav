import { ActivityIndicator, Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, Vibration, View } from 'react-native';
import React, { useContext, useState } from 'react';

import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { AuthenticationContext } from '../../ContextApi/AuthenticationContext';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import NetInfo from '@react-native-community/netinfo';

const { height, width } = Dimensions.get('screen');

const AdminLogin = () => {
    const { login } = useContext(AuthenticationContext);
    const { language } = useContext(LanguageContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isTextSecure, setTextSecure] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const toggleSecureText = () => {
        setTextSecure(!isTextSecure);
    };

    const validate = () => {
        let isValid = true;
        if (!username) {
            setNameError('Username is required.');
            isValid = false;
        } else if (username.length < 2) {
            setNameError('Username must be at least 2 characters.');
            isValid = false;
        } else {
            setNameError('');
        }

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

    const checkNetworkAndLogin = async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert(
                'Network Problem',
                'Turn on your Mobile Data or Wifi',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        logInUser();
    };

    const logInUser = async () => {
        if (validate()) {
            try {
                Vibration.vibrate(100);
                setLoading(true);

                const response = await axios.post('http://192.168.1.24:8000/api/politician_login/', {
                    politician_name: username,
                    politician_password: password,
                });

                if (response.status === 200) {
                    const responseData = response.data.token;
                    login(responseData);
                }
            } catch (error) {
                Alert.alert('Alert', 'Invalid credentials. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <LinearGradient
            colors={['#3C4CAC', '#F04393']}
            locations={[0.01, 0.4]}
            style={styles.linearGradient}
        >
            <View style={styles.headerContainer}>
                <Image source={require('../../../assets/tekhnoWhite.png')} style={styles.logo} />
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>{language === 'en' ? 'Log in' : 'लॉग इन'}</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{language === 'en' ? 'Username or Mobile' : 'वापरकर्तानाव किंवा मोबाइल'}</Text>
                    <TextInput
                        value={username}
                        placeholder={language === 'en' ? 'Enter username or mobile here ...' : 'येथे वापरकर्तानाव किंवा मोबाइल प्रविष्ट करा ...'}
                        onChangeText={setUsername}
                        style={styles.input}
                        accessibilityLabel="Username input"
                        accessibilityHint="Enter your username"
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>{language === 'en' ? 'Password' : 'पासवर्ड'}</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            value={password}
                            placeholder={language === 'en' ? 'Enter password here ...' : 'इथे पासवर्ड टाका...'}
                            onChangeText={setPassword}
                            secureTextEntry={isTextSecure}
                            style={styles.passwordInput}
                            accessibilityLabel="Password input"
                            accessibilityHint="Enter your password"
                        />
                        <Pressable onPress={toggleSecureText} style={styles.eyeIcon}>
                            <Feather name={isTextSecure ? "eye-off" : "eye"} size={24} color="black" />
                        </Pressable>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <Pressable onPress={checkNetworkAndLogin} style={styles.loginButton}>
                    {!isLoading ? (
                        <Text style={styles.loginButtonText}>{language === 'en' ? 'Log in' : 'लॉग इन करा'}</Text>
                    ) : (
                        <ActivityIndicator color={'white'} size={'large'} />
                    )}
                </Pressable>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    headerContainer: {
        flex: 0.35,
        paddingTop: height * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        height: width * 0.5,
        width: width * 0.5,
    },
    formContainer: {
        flex: 0.7,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    inputContainer: {
        marginVertical: 5,
    },
    label: {
        color: '#424955',
        fontSize: 18,
        fontWeight: '700',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#BCC1CA',
        paddingVertical: 10,
        borderRadius: 8,
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 5,
        width: '100%',
        borderWidth: 1,
        borderColor: '#BCC1CA',
        alignItems: 'center',
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    passwordInput: {
        flex: 1,
        padding: 10,
    },
    eyeIcon: {
        paddingRight: 10,
    },
    loginButton: {
        backgroundColor: '#E54394',
        width: '100%',
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        paddingVertical: 10,
        marginTop: height * 0.05
    },
    loginButtonText: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        color: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
    },
});

export default AdminLogin;
