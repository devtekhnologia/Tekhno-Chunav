import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const BoothUserContext = createContext();

export const BoothUserProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);
    const [buserName, setBuserName] = useState(null);
    const [boothId, setBoothId] = useState(null);
    const [buserId, setBuserId] = useState(null)
    const [isBuserAuthenticated, setBuserAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    console.log(token);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('BUserToken');
            if (storedUser) {
                const decoded = jwtDecode(storedUser);
                setBuserId(JSON.parse(decoded.user_id));
                const expirationDate = new Date(decoded.exp * 1000);

                if (expirationDate > new Date()) {
                    setBoothId(decoded.politician_id);
                    setToken(storedUser);
                    setBuserAuthenticated(true);
                } else {
                    await AsyncStorage.removeItem('BUserToken');
                    setBuserAuthenticated(false);
                }
            }
        } catch (error) {
            Alert.alert('Error loading user token from storage', error.toString ? error.toString() : 'Unknown error');
        }
    };


    useEffect(() => {
        loadUser();
    }, []);

    const loginBuser = async (userData) => {
        try {
            const decoded = jwtDecode(userData);
            const expirationDate = new Date(decoded.exp * 1000);

            setToken(userData);
            setBuserId(decoded.user_id);
            setBuserAuthenticated(true);
            await AsyncStorage.setItem('BUserToken', JSON.stringify(userData));
        } catch (error) {
            Alert.alert('Error during login', error.toString ? error.toString() : 'Unknown error');
        }
    };

    const logoutBuser = async () => {
        try {
            setBuserId(null);
            setToken(null);
            setBuserAuthenticated(false);
            await AsyncStorage.removeItem('BUserToken');
        } catch (error) {
            Alert.alert('Error during logout', error.toString ? error.toString() : 'Unknown error');
        }
    };

    return (
        <BoothUserContext.Provider value={{ userName, setUserName, boothId, setBoothId, buserId, setBuserId, buserName, setBuserName, logoutBuser, isBuserAuthenticated, loginBuser }}>
            {children}
        </BoothUserContext.Provider>
    );
};