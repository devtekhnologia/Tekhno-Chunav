import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { AuthenticationContext } from '../Context_Api/AuthenticationContext';

const { height } = Dimensions.get('screen');
const topMargin = height * 0.1;

const LogOut = () => {
    const navigation = useNavigation();
    const { logout } = useContext(AuthenticationContext);

    const handleLogOut = async () => {
        try {
            // Make the logout request without token
            const response = await axios.post(
                'http://192.168.1.38:8000/api/politician_logout/',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                // Clear any user-related data if needed
                logout();
                navigation.replace('Entry');
            } else {
                Alert.alert('Error', 'Logout failed. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0.1, 1]}
                style={styles.gradient}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.bigText}>Log Out?</Text>
                    <Text style={styles.text}>Are you sure you want to log out?</Text>
                    <Image
                        source={require('../../../assets/bye.png')}
                        style={{ width: 140, height: 140, marginVertical: 20 }}
                    />
                </View>

                <View style={styles.bottomView}>
                    <Pressable
                        onPress={handleLogOut}
                        style={styles.logoutButton}
                    >
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </Pressable>

                    <Pressable onPress={handleGoBack} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </Pressable>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default LogOut;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 0.45,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        height: height * 0.325,
        alignItems: 'center',
        marginTop: topMargin,
    },
    bigText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '600',
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    bottomView: {
        width: '100%',
        height: height * 0.7,
        padding: 60,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    logoutButton: {
        width: 150,
        backgroundColor: '#E54394',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 4,
        margin: 20,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        width: 150,
        backgroundColor: '#9095A1',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 4,
        margin: 20,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});
