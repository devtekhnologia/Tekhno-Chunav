import { Alert, Dimensions, Image, View, StyleSheet, Text, } from 'react-native';
import React, { useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomeTextInput from './CustomeTextInput';
import TopNavCompo from '../../ReusableCompo/TopNavCompo';
import { LanguageContext } from '../../ContextApi/LanguageContext';


const { width, height } = Dimensions.get('screen')
const Profile = () => {
    const { language } = useContext(LanguageContext);
    const navigation = useNavigation();

    return (
        <>
            <View style={{ height: height * 0.3 }}>
                <LinearGradient
                    colors={['#3C4CAC', '#F04393']}
                    locations={[0.2, 1]}
                    style={styles.gradient}
                >
                    <TopNavCompo navigation={navigation} ScreenName={language === 'en' ? 'Profile' : 'प्रोफाइल'} colorName={'white'} />
                </LinearGradient>
            </View>
            <View style={{ height: height * 0.45 }}>
                <View style={styles.profileDetailsView}>
                    <View style={styles.profileImageView}>
                        <View style={styles.profileImageCircle}>
                            <Image source={require('../../../assets/Cover.png')} style={styles.profileImage} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>{language === 'en' ? 'Admin' : 'प्रशासन'}</Text>
                    </View>
                    <View style={{
                        width: "100%",
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 10,
                    }}>
                        <CustomeTextInput
                            label={language === 'en' ? 'User Name : ' : 'वापरकर्तानाव : '}
                            valueDetails={'Politician'}
                            styles={styles.profileTextInput}
                            readValue={true}
                        />

                        <CustomeTextInput
                            label={language === 'en' ? 'Contact No : ' : 'संपर्क क्र : '}
                            valueDetails={'+91 1234567890'}
                            styles={styles.profileTextInput}
                            readValue={true}
                        />

                        <CustomeTextInput
                            label={language === 'en' ? 'Constituency : ' : 'मतदारसंघ : '}
                            valueDetails={'Washim'}
                            styles={styles.profileTextInput}
                            readValue={true}
                        />
                    </View>
                </View>
            </View >

            <View style={{ height: height * 0.1 }}>
                <Pressable style={styles.logOutButton} onPress={() => { navigation.navigate('LogOut') }}>
                    <Text style={styles.logOutButtonTxt}>{language === 'en' ? 'Log Out' : 'लॉग आउट'}</Text>
                </Pressable>
            </View>
        </ >
    );
};

export default Profile;

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        padding: 10,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    profileDetailsView: {
        height: height * 0.45,
        width: "90%",
        elevation: 5,
        borderRadius: 10,
        marginTop: '-17%',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    profileImageView: {
        width: '100%',
        height: height * 0.13,
        borderBottomWidth: 1,
        borderBlockColor: 'black',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
    },
    profileImageCircle: {
        width: width * 0.28,
        height: width * 0.28,
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: width,
        borderColor: '#3C4CAC',
        marginTop: - height * 0.1,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
    profileTextInput: {
        width: width * 0.8,
        height: height * 0.06,
        borderRadius: 8,
        paddingStart: 20,
        marginVertical: 8,
        backgroundColor: 'rgba(236, 238, 247, 1)',
        fontSize: 18,
        color: 'black'
    },
    logOutButton: {
        width: width * 0.8,
        height: 50,
        backgroundColor: '#F04393',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        borderRadius: 7,
    },
    logOutButtonTxt: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
    }
});
