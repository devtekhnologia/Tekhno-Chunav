import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const PSCUserContext = createContext();

export const PSCUserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [pscUserName, setpscUserName] = useState('');
  const [boothId, setBoothId] = useState('');
  const [pscUserId, setPSCuserId] = useState(null)
  const [isPSCuserAuthenticated, setPSCuserAuthenticated] = useState(false);
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null);
  console.log(token);

  const PSCloadUser = async () => {
    try {
      const storedUserToken = await AsyncStorage.getItem('PSCuserToken');
      if (storedUserToken) {
        try {
          const decoded = jwtDecode(storedUserToken);
          setPSCuserId(JSON.parse(decoded.user_id));
          const expirationDate = new Date(decoded.exp * 1000);

          if (expirationDate > new Date()) {
            setPSCuserId(decoded.user_id);
            setToken(storedUserToken);
            setPSCuserAuthenticated(true);
          } else {
            logoutPSCuser();
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
    PSCloadUser();
  }, []);

  const pscUserLogin = async (userData) => {
    try {
      const decoded = jwtDecode(userData);
      const expirationDate = new Date(decoded.exp * 1000);
      console.log("Decoded token: ", decoded);

      setToken(userData);
      setPSCuserId(decoded.user_id);
      setPSCuserAuthenticated(true);
      await AsyncStorage.setItem('PSCuserToken', JSON.stringify(userData));
    } catch (error) {
      Alert.alert('Error during login:', error.toString ? error.toString() : 'Unknown error');
      setError('Failed to log in. Invalid token or network error.');
    }
  };

  const logoutPSCuser = async () => {
    try {
      setPSCuserId(null);
      setToken(null);
      setPSCuserAuthenticated(false);
      await AsyncStorage.removeItem('PSCuserToken');
    } catch (error) {
      Alert.alert('Error during logout:', error.toString ? error.toString() : 'Unknown error');
      setError('Failed to log out. Please try again.');
    }
  };
  return (
    <PSCUserContext.Provider value={{ userName, setUserName, boothId, setBoothId, pscUserId, setPSCuserId, pscUserName, setpscUserName, pscUserLogin, logoutPSCuser, isPSCuserAuthenticated }}>
      {children}
    </PSCUserContext.Provider>
  );
};