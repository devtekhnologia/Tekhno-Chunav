import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthenticationContext } from '../ContextApi/AuthenticationContext';
import { TownUserContext } from '../ContextApi/TownUserProvider';
import { BoothUserContext } from '../ContextApi/BuserContext';
import { WardUserContext } from '../ContextApi/WardUserContext';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { KaryakartaContext } from '../ContextApi/KaryakartaContext';

const { height, width } = Dimensions.get('screen');
const topMargin = height * 0.1;

const Button = ({ onPress, title, backgroundColor }) => (
    <Pressable
        onPress={onPress}
        style={[styles.button, { backgroundColor }]}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
);

const LogOut = () => {
    const { language } = useContext(LanguageContext);
    const navigation = useNavigation();
    const { isTuserAuthenticated, logoutTuser } = useContext(TownUserContext);
    const { logoutWuser, isWarduserAuthenticated } = useContext(WardUserContext)
    const { logout, isAuthenticated } = useContext(AuthenticationContext);
    const { isBuserAuthenticated, logoutBuser } = useContext(BoothUserContext)
    const { isKaryakartaAuthenticated, KuserId, token, Klogin, Klogout } = useContext(KaryakartaContext)
    const handleLogOut = async () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK", onPress: async () => {
                        if (isAuthenticated) {
                            await logout();
                        }

                        if (isWarduserAuthenticated) {
                            await logoutWuser();
                        }

                        if (isTuserAuthenticated) {
                            await logoutTuser();
                        }

                        if (isBuserAuthenticated) {
                            await logoutBuser();
                        }

                        if (isKaryakartaAuthenticated) {
                            await Klogout();
                        }
                    }
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0.1, 1]}
                style={styles.gradient}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.bigText}>{language === 'en' ? 'Log Out' : 'लॉग आउट'}</Text>
                    <Text style={styles.text}>{language === 'en' ? 'Are you sure you want to log out?' : 'तुमची खात्री आहे की तुम्ही लॉग आउट करू इच्छिता?'}</Text>
                    <Image
                        source={require('../../assets/bye.png')}
                        style={styles.image}
                    />
                </View>

                <View style={styles.bottomView}>
                    <Button
                        onPress={handleLogOut}
                        title={language === 'en' ? 'Log Out' : 'लॉग आउट'}
                        backgroundColor="#E54394"
                    />
                    <Button
                        onPress={() => navigation.goBack()}
                        title={language === 'en' ? 'Cancel' : 'रद्द करा'}
                        backgroundColor="#9095A1"
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default LogOut;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 0.5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        height: height * 0.3,
        alignItems: 'center',
        marginTop: topMargin,
    },
    bigText: {
        color: '#fff',
        fontSize: height * 0.05,
        fontWeight: '600',
    },
    text: {
        color: '#fff',
        fontSize: height * 0.02,
    },
    image: {
        width: width * 0.35,
        height: width * 0.35,
        marginTop: 20,
    },
    bottomView: {
        width: '100%',
        height: height * 0.7,
        padding: 60,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    button: {
        width: width * 0.5,
        height: 45,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 4,
        margin: 20,
        elevation: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
});
