import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import WardHeaderFooter from './WardHeaderFooter';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { WardUserContext } from '../ContextApi/WardUserContext';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';


// const { height, width } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);

const { width, height } = Dimensions.get('screen');
export default function WardBooths() {
    const { language, toggleLanguage } = useContext(LanguageContext);
    const navigation = useNavigation()
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [booths, setBooths] = useState([]);
    const { wardUserId } = useContext(WardUserContext);


    const searchedBooth = booths.filter(booth => {
        const boothId = booth.booth_id ? booth.booth_id.toString().toLowerCase() : '';
        const boothName = booth.booth_name ? booth.booth_name.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();
        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });


    const fetchData = async () => {
        try {
            const statesResponse = await axios.get(`http://192.168.1.38:8000/api/booth_details_by_prabhag_user/${wardUserId}`);
            const formattedTowns = statesResponse.data;

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

    const handleGoBack = () => {
        navigation.goBack();
    };

    const rightIconAction = () => {
        navigation.navigate('Location Wise');
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
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => (
                    <Pressable style={styles.voterItem}
                        onPress={() => {
                            navigation.navigate('Booth Voters', { boothId: item.booth_id });
                        }}
                    >
                        <Text style={styles.boothIdText}>{item.booth_id}</Text>
                        <Text style={styles.boothNameText}>{language === 'en' ? item.booth_name : item.booth_name_mar}</Text>
                    </Pressable>
                )}
                ListHeaderComponent={loading && <LoadingListComponent />}
                ListEmptyComponent={!loading && <EmptyListComponent />}
            />

        </View>
    );
}


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
        marginTop: 50

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
