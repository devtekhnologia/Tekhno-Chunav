import { Alert, Dimensions, Image, Linking, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import SendWhatsAppMessage from './SendWhatsAppMessage';

const { height, width } = Dimensions.get('screen');
const topMargin = height * 0.1;



const ContactUs = () => {

    const sendWhatsAppMessage = (phoneNumber) => {
        let message = "Hello, this is a test message from my React Native app.";

        // URL Scheme for WhatsApp
        let url = `whatsapp://send?text=${encodeURIComponent(message)}&phone=${phoneNumber}`;

        // Check if WhatsApp is installed on the device
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    Alert.alert(
                        'WhatsApp is not installed',
                        'Please install WhatsApp to send a message.',
                        [{ text: 'OK' }]
                    );
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => Alert.alert("An error occurred", err));
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
                    <Text style={styles.bigText}>GET IN TOUCH!</Text>
                    <Text style={styles.text}>Always within your reach</Text>
                    <Image source={require('../../../assets/getInTouch.png')}
                        style={{ width: width * 0.55, height: height * 0.3, }}
                    />
                </View>

                <View style={styles.bottomView} >
                    <View style={{ marginVertical: 10 }}>
                        <Text style={styles.sectionTitle}>Contact No.</Text>
                        <Pressable style={styles.infoContainer} onPress={() => { sendWhatsAppMessage('7666710289') }}>
                            <Ionicons name="call" size={18} color="black" />
                            <Text>7666710289</Text>
                        </Pressable>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={styles.sectionTitle}>Email</Text>
                        <View style={styles.infoContainer}>
                            <Octicons name="mail" size={18} color="black" style={{ marginTop: 2 }} />
                            <Text>tekhno.marketing@gmail.com</Text>
                        </View>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={styles.sectionTitle}>Website</Text>
                        <TouchableOpacity style={styles.infoContainer}
                            onPress={() => Linking.openURL('https://tekhchunavs.blogspot.com')}
                        >
                            <AntDesign name="earth" size={18} color="black" style={{ marginTop: 2 }} />
                            <Text>https://tekhchunavs.blogspot.com</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </LinearGradient>
        </SafeAreaView>
    );
};

export default ContactUs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 0.45,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contentContainer: {
        width: '100%',
        height: height * 0.325,
        alignItems: 'center',
        marginTop: topMargin,
    },
    bigText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    text: {
        color: '#fff',
    },
    bottomView: {
        width: '100%',
        height: height * 0.7,
        padding: 30,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
    },
    sectionTitle: {
        color: '#3C4CAC',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderColor: '#9095A1',
        columnGap: 10,
        padding: 5,
    },
});
