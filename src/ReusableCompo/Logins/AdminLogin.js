import { ActivityIndicator, Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, Vibration, View, } from 'react-native';
import React, { useContext, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { AuthenticationContext } from '../../ContextApi/AuthenticationContext';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WardUserContext } from '../../ContextApi/WardUserContext';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import { BoothUserContext } from '../../ContextApi/BuserContext';

const { height, width } = Dimensions.get('screen');

const AdminLogin = ({ navigation }) => {
    const { login } = useContext(AuthenticationContext);
    const { townUserLogin } = useContext(TownUserContext)
    const { loginBuser } = useContext(BoothUserContext)
    const {wardlogin} = useContext(WardUserContext)
    const { language } = useContext(LanguageContext);
    const [userPhone, setUserPhone] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isTextSecure, setTextSecure] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const toggleSecureText = () => {
        setTextSecure(!isTextSecure);
    };

    const validate = () => {
        let isValid = true;
        if (!userPhone) {
            setPhoneError('Phone number is required.');
            isValid = false;
        } else if (userPhone.length < 10) {
            setPhoneError('Phone number must be at least 10 digits.');
            isValid = false;
        } else {
            setPhoneError('');
        }

        if (!userPassword) {
            setPasswordError('Password is required.');
            isValid = false;
        } else if (userPassword.length < 5) {
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

                const response = await axios.post('http://192.168.1.38:8000/api/common_login/', {
                    user_phone: userPhone,
                    user_password: userPassword,
                });

                console.log('Login Response:', response.data);

                if (response.status === 200) {
                    const { token, table_name, user_id } = response.data;

                    switch (table_name) {
                        case 'tbl_politician':
                            login(token); 
                            break;
                        case 'tbl_prabhag_user':
                            wardlogin(token); 
                            break;
                        case 'tbl_town_user':
                            townUserLogin(token); 
                            break;
                        case 'tbl_user':
                            loginBuser(token); 
                            break;
                        case 'tbl_karyakarta':
                            karyakartaContext.loginKaryakartaUser(token); 
                            break;
                        default:
                            Alert.alert('Error', 'Unknown user role.');
                            return;
                    }

                    // Navigate to appropriate screen if needed
                    console.log('Login successful!');
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
                    <Text style={styles.label}>
                        {language === 'en' ? 'Phone Number' : 'फोन नंबर'}
                    </Text>
                    <TextInput
                        value={userPhone}
                        placeholder={
                            language === 'en'
                                ? 'Enter phone number here ...'
                                : 'येथे फोन नंबर प्रविष्ट करा ...'
                        }
                        onChangeText={setUserPhone}
                        keyboardType="phone-pad"
                        style={styles.input}
                    />
                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        {language === 'en' ? 'Password' : 'पासवर्ड'}
                    </Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            value={userPassword}
                            placeholder={
                                language === 'en' ? 'Enter password here ...' : 'इथे पासवर्ड टाका...'
                            }
                            onChangeText={setUserPassword}
                            secureTextEntry={isTextSecure}
                            style={styles.passwordInput}
                        />
                        <Pressable onPress={toggleSecureText} style={styles.eyeIcon}>
                            <Feather name={isTextSecure ? 'eye-off' : 'eye'} size={24} color="black" />
                        </Pressable>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <Pressable onPress={checkNetworkAndLogin} style={styles.loginButton}>
                    {!isLoading ? (
                        <Text style={styles.loginButtonText}>
                            {language === 'en' ? 'Log in' : 'लॉग इन करा'}
                        </Text>
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
