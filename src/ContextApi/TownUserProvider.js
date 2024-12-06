import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const TownUserContext = createContext();

export const TownUserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [tuserName, settuserName] = useState('');
  const [boothId, setBoothId] = useState('');
  const [userId, setUserId] = useState(null)
  const [isTuserAuthenticated, setTuserAuthenticated] = useState(false);
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null);
  console.log(token);

  const loadUser = async () => {
    try {
      const storedUserToken = await AsyncStorage.getItem('TUserToken');
      if (storedUserToken) {
        try {
          const decoded = jwtDecode(storedUserToken);
          setUserId(JSON.parse(decoded.town_user_id));
          const expirationDate = new Date(decoded.exp * 1000);

          if (expirationDate > new Date()) {
            setUserId(decoded.town_user_id);
            setToken(storedUserToken);
            setTuserAuthenticated(true);
          } else {
            logoutTuser();
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
      setUserId(decoded.town_user_id);
      setTuserAuthenticated(true);
      await AsyncStorage.setItem('TUserToken', JSON.stringify(userData));
    } catch (error) {
      Alert.alert('Error during login:', error.toString ? error.toString() : 'Unknown error');
      setError('Failed to log in. Invalid token or network error.');
    }
  };

  const logoutTuser = async () => {
    try {
      setUserId(null);
      setToken(null);
      setTuserAuthenticated(false);
      await AsyncStorage.removeItem('TUserToken');
    } catch (error) {
      Alert.alert('Error during logout:', error.toString ? error.toString() : 'Unknown error');
      setError('Failed to log out. Please try again.');
    }
  };
  return (
    <TownUserContext.Provider value={{ userName, setUserName, boothId, setBoothId, userId, setUserId, tuserName, settuserName, login, logoutTuser, isTuserAuthenticated }}>
      {children}
    </TownUserContext.Provider>
  );
};