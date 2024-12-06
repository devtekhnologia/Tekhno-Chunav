import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const WardUserContext = createContext();

export const WardUserProvider = ({ children }) => {
    const [wardusername, setwarduserName] = useState('');
    const [wardUserId, setWardUserId] = useState(null)
    const [boothId, setBoothId] = useState('');
    const [isWarduserAuthenticated, setWarduserAuthenticated] = useState(false);
    const [token, setToken] = useState(null)
    const [error, setError] = useState(null);

    const loadUser = async () => {
        try {
            const storedUserToken = await AsyncStorage.getItem('WardUserToken');
            if (storedUserToken) {
                setToken(storedUserToken);
                try {
                    const decoded = jwtDecode(storedUserToken);
                    const expirationDate = new Date(decoded.exp * 1000);
                    if (expirationDate > new Date()) {
                        setWardUserId(decoded.prabhag_user_id);
                        setWarduserAuthenticated(true);
                    } else {
                        logoutWuser();
                        setError('Token expired. Please log in again.');
                    }
                } catch (error) {
                    Alert.alert('Error decoding token on load:', error.toString ? error.toString() : 'Unknown error');
                    setError('Failed to decode token. Please log in again.');
                }
            }
        } catch (error) {
            Alert.alert('Error loading user data from AsyncStorage:', error.toString ? error.toString() : 'Unknown error');
            setError('Failed to load user data. Please try again later.');
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (userData) => {
        try {
            const decoded = jwtDecode(userData);
            const expirationDate = new Date(decoded.exp * 1000);
            setToken(userData);
            setWardUserId(decoded.prabhag_user_id);
            setWarduserAuthenticated(true);
            await AsyncStorage.setItem('WardUserToken', userData);
        } catch (error) {
            Alert.alert('Error during login:', error.toString ? error.toString() : 'Unknown error');
            setError('Failed to log in. Invalid token or network error.');
        }
    };

    const logoutWuser = async () => {
        try {
            setWardUserId(null);
            setWarduserAuthenticated(false);
            setToken(null);
            await AsyncStorage.removeItem('WardUserToken');
        } catch (error) {
            Alert.alert('Error during logout:', error.toString ? error.toString() : 'Unknown error');
            setError('Failed to log out. Please try again.');
        }
    };
    return (
        <WardUserContext.Provider value={{ boothId, setBoothId, wardUserId, setWardUserId, wardusername, setwarduserName, login, logoutWuser, isWarduserAuthenticated }}>
            {children}
        </WardUserContext.Provider>
    );
};