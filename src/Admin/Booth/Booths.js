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
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LanguageContext } from '../../LanguageContext';
import { closeDatabase, getAllBooths, insertBooth } from '../../Db/BoothTableHelper';
import { BoothsContext } from '../Context_Api/BoothContext';

const { width, height } = Dimensions.get('screen');

const Booths = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);
    const navigation = useNavigation();
    const { booths, setBooths } = useContext(BoothsContext);
    // const [booths, setBooths] = useState([]);
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const scaleValue = useRef(new Animated.Value(1)).current;

    const searchedBooth = booths.filter(booth => {
        const boothId = booth.booth_id ? booth.booth_id.toString().toLowerCase() : '';
        const boothName = booth.booth_name ? booth.booth_name.toLowerCase() : '';
        const boothNameMar = booth.booth_name_mar ? booth.booth_name_mar.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();

        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower) || boothNameMar.includes(searchValueLower);
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const allBooths = await getAllBooths();
            if (allBooths.length > 0) {
                setBooths(allBooths);
            } else {
                const response = await axios.get('http://4.172.246.116:8000/api/booths/');
                const formattedBooths = response.data;
                setBooths(formattedBooths);
                formattedBooths.forEach(booth => { insertBooth(booth) })
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
            closeDatabase();
        }
    };


    useEffect(() => {
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
            const response = await axios.get('http://4.172.246.116:8000/api/generate_pdf/', {
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

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
            console.error('Error downloading PDF:', error);
            Alert.alert('Error', 'Failed to download the PDF.');
        } finally {
            setPdfLoading(false);
        }
    };


    return (
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
                showsVerticalScrollIndicator={false}
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
                ListHeaderComponent={(loading &&
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'small'} />
                        <Text>
                            {language === 'en' ? 'Loading...' : 'लोड करत आहे...'}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={(!loading &&
                    <View style={styles.emptyContainer}>
                        <Text>
                            {language === 'en' ? 'No booths found' : 'कोणत्याही बूथ नाही'}
                        </Text>
                    </View>)}
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
    );
};

export default Booths;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
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
        marginBottom: 10,
        columnGap: 20,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },

    voterItem: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 0.1,
        gap: 10,
        alignItems: 'center',
        flexWrap: 'wrap',

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
        fontSize: 15,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
