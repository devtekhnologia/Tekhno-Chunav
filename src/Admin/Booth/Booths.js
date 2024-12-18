import {Dimensions,FlatList,Pressable,StyleSheet,Text,TextInput,View,Alert,Animated} from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const Booths = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [booths, setBooths] = useState([]);
    const [pdfLoading, setPdfLoading] = useState(false);
    const scaleValue = useRef(new Animated.Value(1)).current;

    const searchedBooth = booths.filter(booth => {
        const boothId = booth.booth_id ? booth.booth_id.toString().toLowerCase() : '';
        const boothName = booth.booth_name ? booth.booth_name.toLowerCase() : '';
        const boothName1 = booth.booth_name_mar ? booth.booth_name_mar.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();

        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower) || boothName1.includes(searchValueLower);
    });

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/booths/');
            const formattedTowns = response.data;

            if (Array.isArray(formattedTowns)) {
                setBooths(formattedTowns);
            } else {
                Alert.alert('Expected an array of booths');
            }
            setLoading(false);
        } catch (error) {
            Alert.alert('Error', `Error fetching data: ${error}`);

            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }),
        ]).start();
    };

    const handlePDFClick = async () => {
        animateButton();

        setPdfLoading(true);
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/generate_pdf/', {
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            ;

            const fileUri = FileSystem.documentDirectory + 'booths_report.pdf';
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            Alert.alert('Success', 'PDF has been saved to your device!');

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to download the PDF.');
        } finally {
            setPdfLoading(false);
        }
    };

    return (
        <HeaderFooterLayout
            headerText={language === 'en' ? "Booths" : 'बूथ'}
            showFooter={false}
            leftIcon={true}
            rightIcon={true}
            leftIconName="keyboard-backspace"
            rightIconName="file-pdf"
            onRightIconPress={handlePDFClick}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder={language === 'en' ? "search booth by name or ID" : 'नाव किंवा आयडीद्वारे बूथ शोधा'}
                        style={styles.searchInput}
                    />
                </View>
                <FlatList
                    data={searchedBooth}
                    keyExtractor={item => item.booth_id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Pressable style={styles.voterItem}
                            onPress={() => { navigation.navigate('Booth Voters', { boothId: item.booth_id }) }}
                        >
                            <View style={styles.topSection}>
                                <Text style={styles.boothIdText}>{item.booth_id}</Text>
                                <Text style={styles.boothNameText}>{language === 'en' ? item.booth_name : item.booth_name_mar}</Text>
                            </View>

                            {/* Bottom Section: Buttons */}
                            <View style={styles.buttonsContainer}>
                                <Pressable
                                    style={styles.votersButton}
                                    onPress={() => { navigation.navigate('Booth Voters', { boothId: item.booth_id }) }}
                                >
                                    <Text style={styles.buttonText}>{language === 'en' ? 'Voters' : 'मतदार'}</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.votersButton}
                                    onPress={() => { navigation.navigate('Booth Voted', { boothId: item.booth_id }) }}
                                >
                                    <Text style={styles.buttonText}>{language === 'en' ? 'Voted' : 'मतदान'}</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    )}
                    ListHeaderComponent={loading && <LoadingListComponent />}
                    ListEmptyComponent={!loading && <EmptyListComponent />}
                />

                {pdfLoading && (
                    <View style={styles.pdfLoadingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={styles.pdfLoadingText}>
                            {language === 'en' ? 'Generating PDF...' : 'PDF व्युत्पन्न करत आहे...'}
                        </Text>
                    </View>
                )}
            </View>
        </HeaderFooterLayout >
    );
};

export default Booths;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 10,
        columnGap: 20,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    voterItem: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'column',
        borderRadius: 1,
        borderWidth: 0.1,
        gap: 15,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    indexText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    boothIdText: {
        borderWidth: 1,
        borderColor: 'blue',
        width: 50,
        textAlign: 'center',
        borderRadius: 3,
        fontWeight: '500',
        marginRight: 10,
    },
    boothNameText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '800',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    votersButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pdfLoadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfLoadingText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
    },
});
