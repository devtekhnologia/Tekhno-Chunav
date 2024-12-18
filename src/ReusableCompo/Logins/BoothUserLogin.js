import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, Vibration, View } from 'react-native'
import React, { useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ActivityIndicator } from 'react-native';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { height, width } = Dimensions.get('screen')
const BoothUserLogin = () => {
    const navigation = useNavigation()
    const { language } = useContext(LanguageContext);
    const { loginBuser } = useContext(BoothUserContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isTextSecure, setTextSecure] = useState(true)
    const [isLoading, setLoading] = useState(false)
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const validate = () => {
        let isValid = true;
        if (!username) {
            setNameError('Username is required.');
            setLoading(false)
            isValid = false;
        } else if (username.length < 2) {
            setNameError('Username must be at least 2 characters.');
            setLoading(false)
            isValid = false;
        } else {
            setNameError('');
            setLoading(false)
        }

        if (!password) {
            setPasswordError('Password is required.');
            setLoading(false)
            isValid = false;
        } else if (password.length < 5) {
            setPasswordError('Password must be at least 5 characters long.');
            setLoading(false)
            isValid = false;
        } else {
            setPasswordError('');
            setLoading(false)
        }

        return isValid;
    };

    const toggleSecureText = () => {
        setTextSecure(!isTextSecure)
    }

    const LogInUser = async () => {
        setLoading(true)
        Vibration.vibrate(100);

        if (validate()) {
            try {
                const response = await axios.post(`http://192.168.1.38:8000/api/user_login/`, {
                    "user_phone": username,
                    "user_password": password
                })

                console.log(response.data);

                if (response.status === 200) {
                    const token = response.data.token
                    loginBuser(token)
                }
            } catch (error) {
                Alert.alert('Error', 'Invalid username or password.');
            }
            setLoading(false)
        }
    }


    return (
        <>
            <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                locations={[0.01, 0.4]}
                style={styles.linearGradient}
            >

                <View style={{
                    flex: 0.35, paddingTop: height * 0.1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image source={require('../../../assets/tekhnoWhite.png')}
                        style={{ height: width * 0.5, width: width * 0.5 }} />
                </View>

                <View style={{
                    flex: 0.7, backgroundColor: 'white', borderTopRightRadius: 15,
                    borderTopLeftRadius: 15, paddingHorizontal: 20, paddingVertical: 30
                }}>

                    <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>{language === 'en' ? 'Log in' : 'लॉग इन'}</Text>
                    <View style={{ paddingVertical: 30 }}>
                        <View style={{ marginVertical: 5 }}>
                            <Text style={{
                                color: '#424955', fontSize: 18, fontWeight: '700'
                            }}>{language === 'en' ? 'Username or Mobile' : 'वापरकर्तानाव किंवा मोबाइल'}</Text>
                            <TextInput
                                value={username}
                                placeholder={language === 'en' ? 'Enter username or mobile here ...' : 'येथे वापरकर्तानाव किंवा मोबाइल प्रविष्ट करा ...'}
                                onChangeText={setUsername}
                                keyboardType='number-pad'
                                textContentType='telephoneNumber'
                                style={{
                                    width: '100%', borderWidth: 1, borderColor: '#BCC1CA',
                                    paddingVertical: 10, borderRadius: 8, marginVertical: 5,
                                    paddingHorizontal: 20,
                                }} />
                            {nameError && <Text style={{ color: 'red' }}>* {nameError}</Text>}
                        </View>


                        <View style={{ marginVertical: 5 }}>
                            <Text style={{
                                color: '#424955', fontSize: 18, fontWeight: '700'
                            }}>{language === 'en' ? 'Password' : 'पासवर्ड'}</Text>
                            <View style={{
                                flexDirection: 'row', paddingHorizontal: 10, marginVertical: 5,
                                width: '100%', borderWidth: 1, borderColor: '#BCC1CA',
                                alignContent: 'center', alignItems: 'center', borderRadius: 8,
                                justifyContent: 'space-between'
                            }}>
                                <TextInput
                                    value={password}
                                    placeholder={language === 'en' ? 'Enter password here ...' : 'इथे पासवर्ड टाका...'}
                                    onChangeText={setPassword}
                                    textContentType='password'
                                    secureTextEntry={isTextSecure}
                                    style={{
                                        flex: 1, padding: 10
                                    }} />
                                <Pressable onPress={toggleSecureText} style={{ paddingRight: 10 }}>
                                    {
                                        isTextSecure ?
                                            <Feather name="eye-off" size={24} color="black" /> :
                                            <Feather name="eye" size={24} color="black" />
                                    }
                                </Pressable>
                            </View>
                            {passwordError &&
                                <Text style={{ color: 'red' }}>* {passwordError}</Text>
                            }
                        </View>
                    </View>

                    <Pressable onPress={LogInUser}
                        style={{
                            backgroundColor: '#E54394', width: '100%', height: 50,
                            borderRadius: 8, marginVertical: 10, paddingVertical: 10
                        }}>
                        {!isLoading ?
                            <Text style={{
                                fontSize: 18, fontWeight: '500',
                                textAlign: 'center', color: 'white',
                                textAlignVertical: 'center'
                            }}>Log in</Text> :
                            <ActivityIndicator color={'white'} size={'large'} />
                        }
                    </Pressable>
                </View>

            </LinearGradient>
        </>
    )
}

export default BoothUserLogin

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
})