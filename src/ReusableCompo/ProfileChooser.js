import { useContext } from 'react';
import { Dimensions, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
const { height, width } = Dimensions.get('screen');
import { LanguageContext } from '../ContextApi/LanguageContext';

const ProfileChooser = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);
    const navigation = useNavigation();
    return (
        <View>
            <ImageBackground
                source={require('../../assets/Cover.png')}
                style={{
                    flex: 1, height: height, width: '100%',
                }}>

                <View style={{
                    height: height, width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}>

                    <LinearGradient
                        colors={['#3C4CAC', '#F04393']}
                        locations={[0.3, 1]}
                        style={styles.linearGradient}
                    >
                        <Image
                            source={require('../../assets/tekhnoWhite.png')}
                            style={{ height: width * 0.5, width: width * 0.5, alignSelf: 'center' }}
                        />
                    </LinearGradient>

                    <View style={{ alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30, fontWeight: '600', paddingVertical: 20 }}>
                            {language === 'en' ? 'Choose Your Profile' : 'तुमचे प्रोफाइल निवडा'}
                        </Text>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Pressable style={styles.pressableStyle} onPress={() => { navigation.navigate('AdminLogin') }}>
                                <View style={{ marginLeft: width * 0.04 }}>
                                    <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={styles.textStyle}>{language === 'en' ? 'Admin' : 'प्रशासक'}</Text>
                                </View>
                            </Pressable>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Pressable style={styles.pressableStyle} onPress={() => { navigation.navigate('WardUserLogin') }}>
                                <View style={{ marginLeft: width * 0.04 }}>
                                    <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={styles.textStyle}> {language === 'en' ? 'Ward User' : 'प्रभाग वापरकर्ता'}</Text>
                                </View>
                            </Pressable>
                        </LinearGradient>


                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Pressable style={styles.pressableStyle} onPress={() => { navigation.navigate('TownUserLogin') }}>
                                <View style={{ marginLeft: width * 0.04 }}>
                                    <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={styles.textStyle}> {language === 'en' ? 'Town User' : 'गाव/शहर वापरकर्ता'}</Text>
                                </View>
                            </Pressable>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Pressable style={styles.pressableStyle} onPress={() => { navigation.navigate('BoothUserLogin') }}>
                                <View style={{ marginLeft: width * 0.04 }}>
                                    <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={styles.textStyle}>{language === 'en' ? 'Booth User' : 'बूथ वापरकर्ता'}</Text>
                                </View>
                            </Pressable>
                        </LinearGradient>

                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.linearGradientBtn}
                        >
                            <Pressable style={styles.pressableStyle} onPress={() => { navigation.navigate('KUserLogin') }}>
                                <View style={{ marginLeft: width * 0.04 }}>
                                    <FontAwesome name="user-circle-o" size={30} color="#3C4CAC" />
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={styles.textStyle}>{language === 'en' ? 'Karyakarta' : 'कार्यकर्ता '}</Text>
                                </View>
                            </Pressable>
                        </LinearGradient>
                    </View>
                    <Pressable
                        style={styles.languageToggle}
                        onPress={toggleLanguage}
                    >
                        <Text style={styles.languageToggleText}>
                            {language === 'en' ? 'EN' : 'MR'}
                        </Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    )
}

export default ProfileChooser;

const styles = StyleSheet.create({
    linearGradient: {
        width: width * 1.3,
        height: height * 0.4,
        paddingTop: height * 0.1,
        borderBottomLeftRadius: width * 0.8,
        borderBottomRightRadius: width * 0.8,
        alignSelf: 'center'
    },
    linearGradientBtn: {
        width: width * 0.6,
        // paddingHorizontal: 2,
        // paddingVertical: 2,
        borderRadius: 8,
        marginVertical: 10,
        padding: height * 0.003
    },
    pressableStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        width: "100%",
        borderRadius: 5,
        paddingVertical: 5,
        // paddingHorizontal: 20,
        // columnGap: width * 0.002
    },
    textStyle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#3C4CAC',

    },
    languageToggle: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#F04393',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    languageToggleText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
