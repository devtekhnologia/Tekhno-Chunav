import { Dimensions, FlatList, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('screen');
const API_BASE_URL = 'http://192.168.1.38:8000/api/';

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
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (selectedMenu) {
            fetchVoterData(selectedMenu);
        }
    }, [selectedMenu]);

    useEffect(() => {
        const searchTerms = searchValue.toLowerCase().trim().split(/\s+/);

        const filtered = voters.filter(voter => {
            const voterName = voter.voter_name ? voter.voter_name.toLowerCase() : '';
            const voterNameMar = voter.voter_name_mar ? voter.voter_name_mar.toLowerCase() : '';
            const voterId = voter.voter_id ? voter.voter_id.toString() : '';
            const voterSerialNumber = voter.voter_serial_number ? voter.voter_serial_number.toString() : '';
            const voterIdCardNumber = voter.voter_id_card_number ? voter.voter_id_card_number.toLowerCase() : '';

            const voterNameParts = voterName.split(/\s+/);
            const voterNameMarParts = voterNameMar.split(/\s+/);

            return searchTerms.every(term =>
                voterId.includes(term) ||
                voterSerialNumber.includes(term) ||
                voterIdCardNumber.includes(term) ||
                voterName.includes(term) ||
                voterNameMar.includes(term) ||
                voterNameParts.some(part => part.includes(term)) ||
                voterNameMarParts.some(part => part.includes(term)) ||
                voterName.startsWith(searchTerms.join(' ')) ||
                voterNameMar.startsWith(searchTerms.join(' '))
            );
        });

        setFilteredVoters(filtered);
    }, [searchValue, voters]);

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchValue}
                    onChangeText={text => setSearchValue(text)}
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
                                    <View style={styles.topSection}>
                                        <Text>
                                            Sr. No: <Text style={styles.label}>{item.voter_serial_number}</Text>
                                        </Text>
                                        <Text>
                                            Voter Id: <Text style={styles.label}>{item.voter_id_card_number}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.bottomSection}>
                                        <Text style={styles.voterName}>
                                            {language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}
                                        </Text>
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
        zIndex: 1000,
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
        flexDirection: 'column',
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        // marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontWeight: '500',
        fontSize: 16,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderStyle: 'dotted',
        marginVertical: 8,
    },
    bottomSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    voterName: {
        fontSize: 18,
        fontWeight:'900',
        color: '#333',
        textAlign: 'center',
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
