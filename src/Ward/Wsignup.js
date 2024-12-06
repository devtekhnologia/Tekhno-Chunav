import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { WardUserContext } from '../ContextApi/WardUserContext';

const { width, height } = Dimensions.get('window');

export default function Wsignup({ navigation }) {
    const { language, toggleLanguage } = useContext(LanguageContext);
    const { wardUserId } = useContext(WardUserContext);
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
    const [selectedBoothIds, setSelectedBoothIds] = useState([]);

    useEffect(() => {
        // Fetch booth data from API
        axios.get(`http://192.168.1.24:8000/api/booth_details_by_prabhag_user/${wardUserId}/`)
            .then(response => {
                const boothsData = response.data.map(booth => ({
                    label: `${booth.booth_id} - ${language === 'en' ? booth.booth_name : booth.booth_name_mar}`,
                    value: booth.booth_id
                }));
                setItems(boothsData);
            })
            .catch(error => {
                Alert.alert('Error fetching booths:', error.toString ? error.toString() : 'Unknown error');
            });
    }, []);

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

                const response = await axios.post('http://192.168.1.24:8000/api/register_booth_user_by_prabhag/', {
                    user_name: name,
                    user_phone: contact,
                    user_password: password,
                    booth_ids: value,
                });

                Alert.alert('Success', 'Signup successful');
            } catch (error) {
                Alert.alert('Error', 'Signup failed. Please try again.');
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

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Checks if there are any errors in the form fields.
     * @returns {boolean} true if there are any errors, false otherwise.
     */
    /******  ba61fa28-cdcb-4c71-9cc0-2236e32e44c2  *******/
    const hasErrors = () => {
        return nameError || contactError || passwordError || townIdError;
    };

    return (
        <>
            <View style={{ height: height * 0.3, width: width }}>
                <LinearGradient
                    colors={['#3C4CAC', '#F04393']}
                    locations={[0.1, 1]}
                    style={styles.container}
                >
                    <View style={styles.nav}>
                        <Pressable onPress={handleGoBack} style={styles.iconLeft}>
                            <MaterialIcons name="keyboard-backspace" size={28} color="white" />
                        </Pressable>

                        <Text style={styles.text}>
                            {language === 'en' ? 'Registration' : 'नोंदणी'}
                        </Text>

                        <View style={styles.iconRight} />
                    </View>
                </LinearGradient>
            </View>

            <View style={[styles.formContainer, { height: hasErrors() ? height * 0.7 : height * 0.6 }]}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        {language === 'en' ? 'Booth User' : 'बूथ वापरकर्ता'}
                    </Text>
                </View>

                <View style={{ paddingVertical: 20 }}>
                    <TextInput style={styles.input} placeholder={language === 'en' ? "Enter Username : " : 'वापरकर्तानाव प्रविष्ट करा:'}
                        placeholderTextColor="grey"
                        value={name} onChangeText={setName}
                    />
                    {nameError ? <Text style={styles.errorText}>*{nameError}</Text> : null}

                    <TextInput style={styles.input} placeholder={language === 'en' ? "Enter Contact No : " : 'संपर्क क्रमांक प्रविष्ट करा:'}
                        placeholderTextColor="grey" value={contact}
                        onChangeText={setContact} keyboardType="phone-pad"
                    />
                    {contactError ? <Text style={styles.errorText}>*{contactError}</Text> : null}

                    <View style={[styles.input, styles.passwordContainer]}>
                        <TextInput style={[styles.passwordInput, { flex: 1 }]}
                            placeholder={language === 'en' ? "Enter Password : " : 'पासवर्ड प्रविष्ट करा:'} placeholderTextColor="grey"
                            secureTextEntry={!isPasswordVisible} value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>*{passwordError}</Text> : null}

                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={(val) => {
                            setValue(val);
                            setSelectedBoothIds(val); // Store the selected booth IDs
                        }}
                        setItems={setItems}
                        multiple={true}
                        min={0}
                        placeholder={selectedBoothIds.length > 0 ?
                            selectedBoothIds.map(id => {
                                const selectedItem = items.find(item => item.value === id);
                                return selectedItem ? `${selectedItem.label}` : '';
                            }).join(', ') :
                            (language === 'en' ? "Select Booth :" : 'बूथ निवडा :')}
                        placeholderStyle={{ color: 'grey' }}
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        selectedItemContainerStyle={styles.selectedItem}
                        listItemContainerStyle={styles.dropdownContaint}
                        zIndex={9999}
                        showArrow={true}
                    />

                    {/* {selectedBoothIds.length > 0 && (
                            <Text style={styles.selectedBoothText}>
                                Selected Booth IDs: {selectedBoothIds.join(', ')}
                            </Text>
                        )} */}

                    {townIdError ? <Text style={styles.errorText}>*{townIdError}</Text> : null}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    <Text style={styles.buttonText}>
                        {loading ? (language === 'en' ? 'Registering...' : 'नोंदणी करत आहे...') : (language === 'en' ? 'Register' : 'नोंदणी')}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

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
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
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
        paddingVertical: 20,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 25,
        top: -width * 0.3,
        elevation: 5,
    },
    input: {
        marginBottom: 15,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: '#000',
        borderWidth: 0.5,
    },
    button: {
        backgroundColor: '#E54394',
        borderRadius: 10,
        marginVertical: 50,
        padding: 15,
        width: width * 0.4,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
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
    selectedBoothText: {
        marginTop: 10,
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


