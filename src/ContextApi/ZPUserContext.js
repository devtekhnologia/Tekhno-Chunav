import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const ZPUserContext = createContext();

export const ZPUserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [zpUsername, setZpUsername] = useState('');
  const [boothId, setBoothId] = useState('');
  const [zpUserId, setZPuserId] = useState(null)
  const [isZPuserAuthenticated, setZPuserAuthenticated] = useState(false);
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null);

  const ZPloadUser = async () => {
    try {
      const storedUserToken = await AsyncStorage.getItem('ZPuserToken');
      if (storedUserToken) {
        try {
          const decoded = jwtDecode(storedUserToken);
          setZPuserId(JSON.parse(decoded.user_id));
          const expirationDate = new Date(decoded.exp * 1000);

          if (expirationDate > new Date()) {
            setZPuserId(decoded.user_id);
            setToken(storedUserToken);
            setZPuserAuthenticated(true);
          } else {
            logoutZPuser();
            setError('Token expired. Please log in again.');
          }
        } catch (error) {
          Alert.alert('Error decoding token on load PS User:', error.toString ? error.toString() : 'Unknown error');
          setError('Failed to decode token. Please log in again.');
        }
      }
    } catch (error) {
      Alert.alert('Error loading user data from AsyncStorage:', error.toString ? error.toString() : 'Unknown error');
      setError('Failed to load user data. Please try again later.');
    }
  };

  useEffect(() => {
    ZPloadUser();
  }, []);

  const zpUserLogin = async (userData) => {
    try {
      const decoded = jwtDecode(userData);
      const expirationDate = new Date(decoded.exp * 1000);
      console.log("Decoded token: ", decoded);

      setToken(userData);
      setZPuserId(decoded.user_id);
      setZPuserAuthenticated(true);
      await AsyncStorage.setItem('ZPuserToken', JSON.stringify(userData));
    } catch (error) {
      Alert.alert('Error during login:', error.toString ? error.toString() : 'Unknown error');
      setError('Failed to log in. Invalid token or network error.');
    }
  };

  const logoutZPuser = async () => {
    try {
      setZPuserId(null);
      setToken(null);
      setZPuserAuthenticated(false);
      await AsyncStorage.removeItem('ZPuserToken');
    } catch (error) {
      Alert.alert('Error during logout:', error.toString ? error.toString() : 'Unknown error');
      setError('Failed to log out. Please try again.');
    }
  };
  return (
    <ZPUserContext.Provider value={{
      token, username, setUsername, boothId, setBoothId, zpUserId, zpUsername,
      setZPuserId, setZpUsername, zpUserLogin, logoutZPuser, isZPuserAuthenticated
    }}>
      {children}
    </ZPUserContext.Provider>
  );
};