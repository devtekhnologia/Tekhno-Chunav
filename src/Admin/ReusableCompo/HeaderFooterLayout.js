import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Octicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HeaderFooterLayout = ({
    children,
    headerText,
    showHeader = true,
    showFooter = true,
    leftIcon = true,
    rightIcon = true,
    leftIconName = 'keyboard-backspace',
    rightIconName = '',
    onLeftIconPress,
    onRightIconPress,
    onSortPress,
}) => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        if (onLeftIconPress) {
            onLeftIconPress();
        } else {
            navigation.goBack();
        }
    };

    const handleNotificationBtn = () => {
        if (onRightIconPress) {
            onRightIconPress();
        } else if (onSortPress) {
            onSortPress();
        } else {
            // Alert.alert("Right button pressed.");
        }
    };

    return (
        <View style={styles.container}>
            {showHeader && (
                <View style={styles.nav}>

                    {leftIcon && (
                        <Pressable onPress={handleGoBack}>
                            <MaterialIcons name={leftIconName} size={30} color="black" />
                        </Pressable>
                    )}
                    <Text style={styles.text}>{headerText}</Text>
                    {rightIcon && (
                        <Pressable onPress={handleNotificationBtn}>
                            <FontAwesome5 name={rightIconName} size={22} color="black" />
                        </Pressable>
                    )}

                </View>
            )}
            <View style={styles.content}>
                {children}
            </View>
            {showFooter && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton} onPress={() => { navigation.navigate('Total Voters') }}>
                        <AntDesign name="home" size={width * 0.05} color="black" />
                        <Text style={styles.footerButtonText}>Total Voters</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Towns')}>
                        <MaterialCommunityIcons name="city-variant-outline" size={width * 0.05} color="black" />
                        <Text style={styles.footerButtonText}>Towns</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Booths')}>
                        <FontAwesome5 name="person-booth" size={width * 0.04} color="black" style={{ padding: 2 }} />
                        <Text style={styles.footerButtonText}>Booth</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Age Wise Voters')}>
                        <MaterialCommunityIcons name="page-next-outline" size={width * 0.05} color="black" />
                        <Text style={styles.footerButtonText}>Voters Age</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
                        <MaterialIcons name="person" size={width * 0.05} color="black" />
                        <Text style={styles.footerButtonText}>Profile</Text>
                    </TouchableOpacity> */}
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
        paddingHorizontal: 20,
        marginTop: 30,
        height: height * 0.04,
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
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
        height: height * 0.08,
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 12,
        color: 'black',
    },
    gradient: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '2%',
    },
});

export default HeaderFooterLayout;
