import { Dimensions, FlatList, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';

const { width, height } = Dimensions.get('window');


const UrbanTowns = () => {
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const { language } = useContext(LanguageContext);
    const [urbanTowns, setUrbanTowns] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUrbanTownList = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/town_voter_count/');
            if (response.status === 200) {
                const filteredData = response.data.filter(town => town.town_type === 1);
                setUrbanTowns(filteredData);
                setFilteredData(filteredData);
            } else {
                // Handle unexpected response status
                console.warn('Unexpected response status:', response.status);
                Alert.alert("Error", "Failed to fetch urban towns. Please try again later.");
            }
        } catch (error) {
            // Handle specific types of errors
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    console.warn('Response error:', error.response.data);
                    Alert.alert("Error", `Failed to fetch urban towns: ${error.response.data.message || 'An error occurred'}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.warn('Network error: No response received', error.request);
                    Alert.alert("Error", "Network error: Please check your connection and try again.");
                } else {
                    // Something happened in setting up the request
                    console.warn('Request setup error:', error.message);
                    Alert.alert("Error", "Request setup failed. Please try again later.");
                }
            } else {
                // Handle unexpected errors that are not Axios related
                console.warn('Unexpected error:', error.toString ? error.toString() : 'Unknown error');
                Alert.alert("Error", "An unexpected error occurred. Please try again later.");
            }
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getUrbanTownList();
    }, []);


    useEffect(() => {
        const filterData = urbanTowns.filter(town =>
            town.town_name.toLowerCase().includes(searchedValue.toLowerCase())
        );
        setFilteredData(filterData);
    }, [searchedValue, urbanTowns]);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchedValue}
                    onChangeText={setSearchValue}
                    placeholder={language === 'en' ? "Search booth by name or ID" : 'नाव किंवा आयडीद्वारे बूथ शोधा'}
                    style={styles.searchInput}
                />
            </View>

            <View style={styles.headerRow}>
                <Text style={[styles.headerText, { flex: 0.15, paddingLeft: 10 }]}>{language === 'en' ? 'Sr. No.' : 'क्र.'}</Text>
                <Text style={[styles.headerText, { flex: 0.65 }]}>{language === 'en' ? 'Town Name' : 'गाव/शहराचे नाव'}</Text>
                <Text style={[styles.headerText, { flex: 0.2 }]}>{language === 'en' ? 'Voters' : 'मतदार'}</Text>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.town_id.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Town Booths', { town_id: item.town_id })}>
                        <Text style={styles.srNo}>{index + 1}</Text>
                        <Text style={styles.townName}>{language === 'en' ? item.town_name : item.town_name_mar}</Text>
                        <Text style={{ flex: 0.2, textAlign: 'center' }}>{item.voter_count}</Text>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={loading && <LoadingListComponent />}
                ListEmptyComponent={!loading && <EmptyListComponent />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default UrbanTowns;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginHorizontal: 15,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 10,
    },
    headerRow: {
        flexDirection: 'row',
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        elevation: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50

    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        fontSize: 17,
    },
    listContainer: {
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    item: {
        flexDirection: 'row',
        paddingVertical: 15,
        marginVertical: 6,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
        paddingHorizontal: 10,
        marginHorizontal: 5
    },
    srNo: {
        flex: 0.15,
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 16,
        textAlign: 'center',
    },
    townName: {
        fontSize: 15,
        color: 'black',
        flex: 1,
        textAlign: 'center',
    },
});
