import {
    FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert, Animated
} from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const TownBooths = ({ route }) => {
    const navigation = useNavigation();
    const { userId } = useContext(TownUserContext)
    const { language } = useContext(LanguageContext);
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [booths, setBooths] = useState([]);
    const [pdfLoading, setPdfLoading] = useState(false);

    const searchedBooth = booths.filter(booth => {
        const boothId = booth.booth_id ? booth.booth_id.toString().toLowerCase() : '';
        const boothName = booth.booth_name ? booth.booth_name.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();

        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://192.168.1.38:8000/api/get_booth_names_by_town_user/${userId}`);
            const formattedTowns = response.data;

            if (Array.isArray(formattedTowns)) {
                setBooths(formattedTowns);
            } else {
                Alert.alert('Expected an array of booths');
            }
            setLoading(false);
        } catch (error) {
            Alert.alert('Message', `Town Booth Not Found`);

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


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
                        <View style={styles.topSection}>
                            <Text style={styles.boothIdText}>{item.booth_id}</Text>
                            <Text style={styles.boothNameText}>{language === 'en' ? item.booth_name : item.booth_name_mar}</Text>
                        </View>

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
        </View>
    );
};

export default TownBooths;

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
    noDataText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: 'gray',
    },

});
