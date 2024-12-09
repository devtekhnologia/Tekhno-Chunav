import { Alert, Dimensions, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Octicons from '@expo/vector-icons/Octicons';
import axios from 'axios';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import { LanguageContext } from '../../ContextApi/LanguageContext';
const { width, height } = Dimensions.get('window');

export default BuserRegistration = ({ navigation }) => {
    const { userId } = useContext(TownUserContext);
    const { language } = useContext(LanguageContext);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [contactError, setContactError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [townIdError, setTownIdError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchBooths = async () => {
            try {
                const response = await axios.get(`http://192.168.1.24:8000/api/get_booth_names_by_town_user/${userId}/`);
                const boothsData = response.data.map(booth => ({
                    label: `${booth.booth_id} - ${language === 'en' ? booth.booth_name : booth.booth_name_mar}`,
                    value: booth.booth_id
                }));
                setItems(boothsData);
            } catch (error) {
                Alert.alert('Error fetching booths:', error.toString ? error.toString() : 'Unknown error');
            }
        };
        fetchBooths();
    }, [userId]);

    const validate = () => {
        let isValid = true;
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        const contactRegex = /^\d{10}$/;

        if (!name) {
            setNameError('Name is required.');
            isValid = false;
        } else if (!nameRegex.test(name)) {
            setNameError('Name must be at least 2 characters long and contain only alphabets.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!contact) {
            setContactError('Contact is required.');
            isValid = false;
        } else if (!contactRegex.test(contact)) {
            setContactError('Contact must be exactly 10 digits long and contain only numbers.');
            isValid = false;
        } else {
            setContactError('');
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

        if (!value.length) {
            setTownIdError('At least one booth must be selected.');
            isValid = false;
        } else {
            setTownIdError('');
        }

        return isValid;
    };

    const handleSignUp = async () => {
        if (validate()) {
            setLoading(true);

            try {
                const response = await axios.post('http://192.168.1.24:8000/api/register_user/', {
                    user_name: name,
                    user_phone: contact,
                    user_password: password,
                    booth_ids: value,
                });


                Alert.alert('Success', 'Signup successful', [
                    {
                        text: 'OK', onPress: () => {
                            setName('');
                            setContact('');
                            setPassword('');
                            setValue([]);
                            navigation.navigate('Dashboard');
                        }
                    }
                ]);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
                Alert.alert('Error', errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const hasErrors = () => {
        return nameError || contactError || passwordError || townIdError;
    };

    return (
        <>
            <View style={{ height: height * 0.3, width }}>
                <LinearGradient
                    colors={['#3C4CAC', '#F04393']}
                    locations={[0.1, 1]}
                    style={styles.container}
                >
                    <View style={styles.nav}>
                        <Pressable onPress={handleGoBack} style={styles.iconLeft}>
                            <Octicons name="arrow-left" size={30} color="white" />
                        </Pressable>
                        <Text style={styles.text}>{language === 'en' ? 'Booth User Registration' : 'बूथ कार्यकर्ता रजिस्टर'}</Text>
                        <View style={styles.iconRight} />
                    </View>
                </LinearGradient>
            </View>

            <View style={[styles.formContainer, { height: hasErrors() ? 600 : 500 }]}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{language === 'en' ? 'Booth User' : 'बूथ कार्यकर्ता'}</Text>
                </View>

                <View style={{ marginTop: 20, }}>
                    <View style={{ marginVertical: 10 }}>
                        <TextInput style={styles.input} placeholder={language === 'en' ? 'Enter Name' : 'नाव टाईप करा'}
                            placeholderTextColor="grey"
                            value={name} onChangeText={setName}
                        />
                        {nameError ? <Text style={styles.errorText}>*{nameError}</Text> : null}
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <TextInput style={styles.input} placeholder={language === 'en' ? 'Enter Contact' : 'संपर्क टाईप करा'}
                            placeholderTextColor="grey" value={contact}
                            onChangeText={setContact} keyboardType="phone-pad"
                        />
                        {contactError ? <Text style={styles.errorText}>*{contactError}</Text> : null}
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <View style={[styles.input, styles.passwordContainer]}>
                            <TextInput style={[styles.passwordInput, { flex: 1 }]}
                                placeholder={language === 'en' ? 'Enter Password' : 'पासवर्ड टाईप करा'}
                                placeholderTextColor="grey"
                                secureTextEntry={!isPasswordVisible} value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                                <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? <Text style={styles.errorText}>*{passwordError}</Text> : null}
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            multiple={true}
                            min={0}
                            placeholder={language === 'en' ? 'Select Booth' : 'बूथ निवडा'}
                            placeholderStyle={{ color: 'grey' }}
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            selectedItemContainerStyle={styles.selectedItem}
                            zIndex={9999}
                            showArrow={true}
                        />
                        {townIdError ? <Text style={styles.errorText}>*{townIdError}</Text> : null}
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Register</Text>}
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    text: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '600',
    },
    iconLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    iconRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    header: {
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    headerText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10,
    },
    formContainer: {
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 15,
        top: -100,
        elevation: 5,
    },
    input: {
        marginBottom: 5,
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: '#000',
        borderWidth: 0.5,
    },
    button: {
        backgroundColor: '#E54394',
        borderRadius: 8,
        // marginVertical: 50,
        paddingVertical: 12,
        width: width * 0.8,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: height * 0.002,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        width: width * 0.8,
        // paddingVertical: 10,
    },
    dropdownContainer: {
        marginBottom: 10,
        width: width * 0.8,
    },
    dropdown: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 0.5,
        paddingHorizontal: 20,
    },
    selectedItem: {
        backgroundColor: 'white',
    },
});
