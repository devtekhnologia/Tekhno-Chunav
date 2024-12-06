import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { LanguageContext } from '../ContextApi/LanguageContext';

const { height } = Dimensions.get('screen');
const topMargin = height * 0.1;

export default function About({ navigation }) {
    const { language, toggleLanguage } = useContext(LanguageContext);
    // const [expandedIndex, setExpandedIndex] = useState(null);


    const handleGoBack = () => {
        navigation.goBack();
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
                    <Text style={styles.headerText}>
                        {language === 'en' ? 'About Us' : 'आमच्याबद्दल'}
                    </Text>
                    <Text style={styles.subText}>
                        {language === 'en' ? 'Our mission is to empower political parties with cutting-edge technology.' : 'राजकीय पक्षांना अत्याधुनिक तंत्रज्ञानाने सक्षम करणे हे आमचे ध्येय आहे.'}
                    </Text>
                    <Image source={require('../../assets/booth1.jpeg')} style={styles.imageTop} />
                </View>

                <View style={styles.bottomView}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.text}>
                            {language === 'en' ? '• In the dynamic world of politics, efficiency and organization are key to successful campaign management...' : '• राजकारणाच्या गतिमान जगात, कार्यक्षमता आणि संघटना यशस्वी मोहीम व्यवस्थापनासाठी महत्त्वाच्या आहेत...'}
                        </Text>

                        <Text style={styles.subTitle}>
                            {language === 'en' ? 'Our Mission' : 'आमचे मिशन'}
                        </Text>
                        <Text style={styles.text}>
                            {language === 'en' ? '• At Election Portal, our mission is to empower political parties and their karyakartas with cutting-edge technology...' : '• निवडणूक पोर्टलवर, राजकीय पक्ष आणि त्यांच्या कार्यकर्त्यांना अत्याधुनिक तंत्रज्ञानाने सक्षम करणे हे आमचे ध्येय आहे...'}
                        </Text>

                        <Text style={styles.subTitle}>
                            {language === 'en' ? 'What We Offer ?' : 'आम्ही काय ऑफर करतो?'}
                        </Text>
                        <Text style={styles.listItem}>
                            {language === 'en' ? '• Real-time Voter Management: Karyakartas can easily mark and update records of each voter...' : '• रिअल-टाइम मतदार व्यवस्थापन: कार्यकर्ता प्रत्येक मतदाराच्या नोंदी सहजपणे चिन्हांकित आणि अद्यतनित करू शकतात...'}
                        </Text>

                        <Text style={styles.subTitle}>
                            {language === 'en' ? 'Our Vision' : 'आमची दृष्टी'}
                        </Text>
                        <Text style={styles.text}>
                            {language === 'en' ? '• We envision a future where technology plays a pivotal role in enhancing the electoral process...' : '• आम्ही अशा भविष्याची कल्पना करतो जिथे तंत्रज्ञान निवडणूक प्रक्रिया सुधारण्यात महत्त्वाची भूमिका बजावते...'}
                        </Text>

                        <Text style={styles.subTitle}>
                            {language === 'en' ? 'Gallery' : 'गॅलरी'}
                        </Text>
                        <View style={styles.imageContainer}>
                            <Image source={require('../../assets/booth2.jpeg')} style={styles.image} />
                            <Image source={require('../../assets/booth3.jpeg')} style={styles.image} />
                            <Image source={require('../../assets/booth4.jpeg')} style={styles.image} />
                        </View>
                    </ScrollView>
                </View>


            </LinearGradient>
        </SafeAreaView>
    );
}

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
    headerText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    subText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    },
    imageTop: {
        width: 200,
        height: 100,
        borderRadius: 20,
        marginTop: 20,
    },
    bottomView: {
        width: '100%',
        height: height * 0.7,
        padding: 30,
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,

    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,

    },
    subTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    text: {
        fontSize: 18,
        textAlign: 'justify',
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        textAlign: 'justify',
        marginBottom: 5,
        marginLeft: 10,
    },
    imageContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 200,
        borderRadius: 20,
        marginHorizontal: 5,
        margin: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'black',
    },
    footerLeft: {
        flexDirection: 'row',
    },
    icon: {
        marginHorizontal: 10,
    },
    helpButton: {
        alignItems: 'flex-end',
    },
    helpText: {
        color: '#fff',
        fontSize: 18,
    },
});
