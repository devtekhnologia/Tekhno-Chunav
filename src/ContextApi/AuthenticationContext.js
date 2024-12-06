import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const loadUser = async () => {
    try {
      const storedUserToken = await AsyncStorage.getItem('userToken');
      if (storedUserToken) {
        const decoded = jwtDecode(storedUserToken);
        const expirationDate = new Date(decoded.exp * 1000);

        if (expirationDate > new Date()) {
          setUserId(decoded.politician_id);
          setToken(storedUserToken);
          setIsAuthenticated(true);
        } else {
          await AsyncStorage.removeItem('userToken');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      Alert.alert('Error loading user token from storage', error.toString ? error.toString() : 'Unknown error');
    }
  };

  useEffect(() => {
    loadUser();
  }, []);


  const login = async (userData) => {
    try {
      const decoded = jwtDecode(userData);  // Decode token
      console.log("Decoded token: ", decoded);

      const expirationDate = new Date(decoded.exp * 1000);

      setToken(userData);
      setUserId(decoded.politician_id);
      setIsAuthenticated(true);
      await AsyncStorage.setItem('userToken', JSON.stringify(userData));
    } catch (error) {
      Alert.alert('Error during login', error.toString ? error.toString() : 'Unknown error');
    }
  };

  const logout = async () => {
    try {
      setUserId(null);
      setIsAuthenticated(false);
      setToken(null);
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      Alert.alert('Error during logout', error.toString ? error.toString() : 'Unknown error');
    }
  };

  return (
    <AuthenticationContext.Provider value={{ isAuthenticated, userId, token, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
