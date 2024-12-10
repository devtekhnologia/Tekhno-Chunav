import {
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Animated
} from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';

const { width, height } = Dimensions.get('screen');

const TownBooths = ({ route }) => {
    const { town_id } = route.params; // Assuming town_id is in route.params

    console.log(town_id);


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
        const searchValueLower = searchedValue.toLowerCase();

        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.24:8000/api/get_booth_details_by_town_id/${town_id}`);
            const formattedTowns = response.data.data;
            console.log(formattedTowns);

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
            const response = await axios.get('http://192.168.1.24:8000/api/generate_pdf/', {
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const fileUri = FileSystem.documentDirectory + 'booths_report.pdf';
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            //Alert.alert('Success', 'PDF has been saved to your device!');

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
            headerText={language === 'en' ? "Town Booths" : 'गाव/शहरातील बूथ'}
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
                        placeholder={language === 'en' ? "Search booth by name or ID" : 'नाव किंवा आयडीद्वारे बूथ शोधा'}
                        style={styles.searchInput}
                    />
                </View>

                <FlatList
                    data={searchedBooth}
                    keyExtractor={item => item.booth_id.toString()}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.voterItem}
                            onPress={() => {
                                navigation.navigate('Booth Voters', { boothId: item.booth_id });
                            }}
                        >
                            <Text style={styles.boothIdText}>{item.booth_id}</Text>
                            <Text style={styles.boothNameText}>{language === 'en' ? item.booth_name : item.booth_name_mar}</Text>
                        </Pressable>
                    )}
                    ListHeaderComponent={loading && (
                        <LoadingListComponent />
                    )}
                    ListEmptyComponent={!loading && (
                        <EmptyListComponent />
                    )}
                />



                {pdfLoading && (
                    <View style={styles.pdfLoadingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={styles.pdfLoadingText}>
                            {language === 'en' ? 'Generating PDF...' : 'PDF व्युत्पन्न करत आहे...'}
                        </Text>
                    </View>
                )}

                {/* <Animated.View style={[styles.pdfButtonContainer, { transform: [{ scale: scaleValue }] }]}>
                    <Pressable onPress={handlePDFClick} style={styles.pdfButton}>
                        <FontAwesome6 name="file-pdf" size={30} color="white" />
                        <Text style={styles.pdfButtonText}>Generate PDF</Text>
                    </Pressable>
                </Animated.View> */}
            </View>
        </HeaderFooterLayout>
    );
};

export default TownBooths;

const styles = StyleSheet.create({
    container: {
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
        paddingVertical: 12,
        paddingHorizontal: 2,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 0.1,
        gap: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 10

    },
    boothIdText: {
        borderWidth: 1,
        borderColor: 'blue',
        width: 30,
        textAlign: 'center',
        borderRadius: 3,
        fontWeight: '700',
    },
    boothNameText: {
        flex: 1,
        flexWrap: 'wrap',
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: 'gray',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    pdfButtonContainer: {
        alignSelf: 'center',
        marginVertical: 20,
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
    },
    pdfButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 18,
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
