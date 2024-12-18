import { Image, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, Vibration } from 'react-native';
import React, { useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserContext } from '../Neta/UserProvider';
import { KaryakartaContext } from '../../ContextApi/KaryakartaContext';

export default function KLogin() {
    const navigation = useNavigation();
    const { setUserId } = useContext(KaryakartaContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isTextSecure, setTextSecure] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');

    const toggleSecureText = () => {
        setTextSecure(!isTextSecure);
    };

    // Validation function
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

    // API integration for login
    const LogInUser = async () => {
        if (validate()) {
            setLoading(true);
            Vibration.vibrate(100);

            try {
                const response = await axios.post('http://192.168.1.38:8000/api/voter_group_login/', {
                    voter_group_user_contact_number: username,
                    voter_group_user_password: password
                });

                if (response.data && response.data.voter_group_user_id) {
                    const userId = response.data.voter_group_user_id;
                    console.log("Logged in successfully. User ID:", userId);

                    // Save userId in context
                    setUserId(userId);

                    // Navigate to the next screen
                    navigation.navigate('KDash');
                } else {
                    console.log("Login failed. Invalid response from server.");
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert('An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <LinearGradient colors={['#3C4CAC', '#F04393']} locations={[0.01, 0.4]} style={styles.linearGradient}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/tekhnowhite.png')} style={styles.logo} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Log In</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username & Contact</Text>
                    <TextInput
                        value={username}
                        placeholder='Enter username & contact here ...'
                        onChangeText={setUsername}
                        style={styles.input}
                    />
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            value={password}
                            placeholder='Enter password here ...'
                            onChangeText={setPassword}
                            secureTextEntry={isTextSecure}
                            style={styles.passwordInput}
                        />
                        <Pressable onPress={toggleSecureText} style={styles.eyeIcon}>
                            <Feather name={isTextSecure ? "eye-off" : "eye"} size={24} color="black" />
                        </Pressable>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>
                <Pressable onPress={LogInUser} style={styles.loginButton}>
                    {!isLoading ? (
                        <Text style={styles.loginButtonText}>Log in</Text>
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
    logoContainer: {
        flex: 0.35,
        paddingTop: "20%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: 220,
        width: 220
    },
    formContainer: {
        flex: 0.7,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center'
    },
    inputContainer: {
        marginVertical: 5
    },
    label: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600'
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
    passwordContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 5,
        width: '100%',
        borderWidth: 1,
        borderColor: '#BCC1CA',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        justifyContent: 'space-between'
    },
    passwordInput: {
        flex: 1,
        padding: 10
    },
    eyeIcon: {
        paddingRight: 10
    },
    loginButton: {
        backgroundColor: '#E54394',
        width: '100%',
        height: 50,
        borderRadius: 8,
        marginVertical: 10,
        paddingVertical: 10
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        color: 'white'
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
