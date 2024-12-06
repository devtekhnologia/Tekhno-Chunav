import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        // Fetch the language preference from AsyncStorage
        const loadLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem('language');
                if (storedLanguage) {
                    setLanguage(storedLanguage);
                }
            } catch (error) {
                console.error('Failed to load language from AsyncStorage', error);
            }
        };

        loadLanguage();
    }, []);

    useEffect(() => {
        // Save language preference to AsyncStorage whenever it changes
        const saveLanguage = async () => {
            try {
                await AsyncStorage.setItem('language', language);
            } catch (error) {
                console.error('Failed to save language to AsyncStorage', error);
            }
        };

        if (language) {
            saveLanguage();
        }
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'mr' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
