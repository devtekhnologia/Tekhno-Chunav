import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../ContextApi/LanguageContext'
import { WardUserContext } from '../ContextApi/WardUserContext';

const { height } = Dimensions.get('window');

const WardHeaderFooter = ({
    children,
    headerText,
    leftIcon,
    leftIconAction,
    rightIcon,
    rightIconAction,
    showFooter = true,
    onSortPress,
}) => {
    const { language, toggleLanguage } = useContext(LanguageContext);
    const navigation = useNavigation();
    const [voterCounts, setVoterCounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { wardUserId } = useContext(WardUserContext);
    const [voterId, setVoterId] = useState([]);
    const [voterNames, setVoterNames] = useState([]);

    const handleLeftIconPress = () => {
        if (leftIconAction) {
            leftIconAction();
        } else {
            navigation.goBack();
        }
    };

    const handleRightIconPress = () => {
        if (rightIconAction) {
            rightIconAction();
        } else if (onSortPress) {
            onSortPress();
        } else {
            "Welcome to Tekhno Chunav"
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.nav}>
                <Pressable onPress={handleLeftIconPress}>
                    {leftIcon}
                </Pressable>

                <Text style={styles.text}>{headerText}</Text>

                <Pressable onPress={handleRightIconPress}>
                    {rightIcon}
                </Pressable>
            </View>

            <View style={styles.content}>
                {children}
            </View>

            {showFooter && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('WardDash')}>
                        <MaterialIcons name="home" size={24} color="black" />
                        <Text style={styles.footerButtonText}>
                            {language === 'en' ? 'Home' : 'डॅशबोर्ड'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Wardvoterlist')}>
                        <MaterialIcons name="list" size={24} color="black" />
                        <Text style={styles.footerButtonText}>
                            {language === 'en' ? 'Voters' : 'मतदार'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Wsignup')}>
                        <MaterialIcons name="sort" size={24} color="black" />
                        <Text style={styles.footerButtonText}>
                            {language === 'en' ? 'Register' : 'नोंदणी'}
                        </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Polls')}>
                        <MaterialIcons name="poll" size={24} color="black" />
                        <Text style={styles.footerButtonText}>Exit Poll</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('WardProfile')}>
                        <MaterialIcons name="person" size={24} color="black" />
                        <Text style={styles.footerButtonText}>
                            {language === 'en' ? 'Profile' : 'प्रोफाइल'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 25,
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: height * 0.07,
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 10,
        color: 'black',
    }
});

export default WardHeaderFooter;
