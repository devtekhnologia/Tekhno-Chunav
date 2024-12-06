import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';

export const KaryakartaContext = createContext();

export const KaryakartaProvider = ({ children }) => {
    const [isKaryakartaAuthenticated, setIsKaryakartaAuthenticated] = useState(false);
    const [KuserId, setKUserId] = useState(null);
    const [token, setToken] = useState(null);

    const loadUser = async () => {
        try {
            const storedUserToken = await AsyncStorage.getItem('KuserToken');
            if (storedUserToken) {
                const decoded = jwtDecode(storedUserToken);
                const expirationDate = new Date(decoded.exp * 1000);

                if (expirationDate > new Date()) {
                    setKUserId(decoded.voter_group_user_id);
                    setToken(storedUserToken);
                    setIsKaryakartaAuthenticated(true);
                } else {
                    await AsyncStorage.removeItem('KuserToken');
                    setIsKaryakartaAuthenticated(false);
                }
            }
        } catch (error) {
            Alert.alert('Error loading user token from storage', error.toString ? error.toString() : 'Unknown error');
        }
    };

    useEffect(() => {
        loadUser();
    }, []);


    const Klogin = async (userData) => {
        try {
            const decoded = jwtDecode(userData);  // Decode token
            console.log("Decoded token: ", decoded);

            const expirationDate = new Date(decoded.exp * 1000);

            setToken(userData);
            setKUserId(decoded.voter_group_user_id);
            setIsKaryakartaAuthenticated(true);
            await AsyncStorage.setItem('KuserToken', JSON.stringify(userData));
        } catch (error) {
            Alert.alert('Error during Klogin', error.toString ? error.toString() : 'Unknown error');
        }
    };


    const Klogout = async () => {
        try {
            setKUserId(null);
            setIsKaryakartaAuthenticated(false);
            setToken(null);
            await AsyncStorage.removeItem('KuserToken');
        } catch (error) {
            Alert.alert('Error during Klogout', error.toString ? error.toString() : 'Unknown error');
        }
    };

    return (
        <KaryakartaContext.Provider value={{ isKaryakartaAuthenticated, KuserId, token, Klogin, Klogout }}>
            {children}
        </KaryakartaContext.Provider>
    );
};
