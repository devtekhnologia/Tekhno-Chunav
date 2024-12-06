import { Dimensions, FlatList, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('screen');
const API_BASE_URL = 'http://192.168.1.24:8000/api/';

const menuItems = [
    { label: 'Favour', value: '1' },
    { label: 'Against', value: '2' },
    { label: 'Doubted', value: '3' },
    { label: 'Pro+', value: '4' },
    { label: 'Pro ', value: '5' },
    { label: 'No Vote', value: '6' },
    { label: 'No Vote Voted', value: '7' },
];

const Favours = () => {
    const { language } = useContext(LanguageContext);
    const [searchValue, setSearchValue] = useState('');
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch data based on selected menu item
    const fetchVoterData = async (menuId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}favour_wise_voter_list/${menuId}/`, {
                params: { favour_id: menuId }
            });
            setVoters(response.data.voters || []);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch voter data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch data when selectedMenu changes
    useEffect(() => {
        if (selectedMenu) {
            fetchVoterData(selectedMenu);
        }
    }, [selectedMenu]);

    // Filter voter data based on Searchinput
    const filteredVoters = voters.filter(voter =>
        (voter.voter_id && voter.voter_id.toString().includes(searchValue)) ||
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (voter.voter_name_mar && voter.voter_name_mar.toLowerCase().includes(searchValue.toLowerCase()))
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchValue}
                    onChangeText={setSearchValue}
                    placeholder={language === 'en' ? 'Search Voter by ID, Name, or Marathi Name' : 'ओळखपत्र, नाव किंवा मराठी नावाने मतदार शोधा'}
                    style={styles.searchInput}
                />
            </View>

            <DropDownPicker
                open={openDropdown}
                value={selectedMenu}
                items={menuItems}
                setOpen={setOpenDropdown}
                setValue={setSelectedMenu}
                placeholder={language === 'en' ? 'Select a Category' : "एक श्रेणी निवडा"}
                containerStyle={{ marginBottom: 10 }}
                style={styles.dropdown}
            />

            <View style={styles.listContainer}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : (
                    <FlatList
                        data={filteredVoters}
                        keyExtractor={(item) => item.voter_id.toString()}
                        showsVerticalScrollIndicator={true}
                        renderItem={({ item, index }) => (
                            <View style={styles.voterItem}>
                                <View style={styles.voterDetails}>
                                    <Text style={styles.index}>{index + 1}</Text>
                                    <View>
                                        <Text style={styles.voterName}>{item.voter_name}</Text>
                                        <Text style={styles.voterMarathiName}>{item.voter_name_mar}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

export default Favours;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
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
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: 'grey',
    },
    dropdown: {
        zIndex: 1000,  // Fix potential rendering issues
    },
    listContainer: {
        flex: 1,
    },
    voterItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 1,
        borderWidth: 0.1,
        backgroundColor: '#f9f9f9',
    },
    voterDetails: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    index: {
        borderWidth: 1,
        borderColor: 'blue',
        width: 30,
        textAlign: 'center',
        borderRadius: 3,
        fontWeight: '700',
    },
    voterName: {
        fontSize: 16,
        fontWeight: '500',
    },
    voterMarathiName: {
        fontSize: 14,
        color: 'grey',
    },
    voterId: {
        fontSize: 12,
        color: 'grey',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});
