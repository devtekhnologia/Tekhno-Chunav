import { Dimensions, StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';


const { width, height } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);


export default function BLocationWise({ navigation }) {
    const { buserId } = useContext(BoothUserContext);
    const { language } = useContext(LanguageContext);
    const [boothValue, setBoothValue] = useState(null);
    const [boothItems, setBoothItems] = useState([]);
    const [locationValue, setLocationValue] = useState(null);
    const [locationItems] = useState([
        { label: language === 'en' ? 'In City' : 'शहरामध्ये', value: 1 },      // ID 1 for In City
        { label: language === 'en' ? 'Near City' : 'शहराजवळ', value: 2 },    // ID 2 for Near City
        { label: language === 'en' ? 'Out of City' : 'शहराबाहेर', value: 3 }   // ID 3 for Out of City
    ]);

    const [voterData, setVoterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBoothData();
    }, []);

    const fetchBoothData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.24:8000/api/user_booth/${buserId}`);
            const boothData = response.data.map(booth => ({
                label: `${booth.user_booth_booth_id} - ${language === 'en' ? booth.booth_name : booth.booth_name_mar}`,
                value: booth.user_booth_booth_id,
            }));

            setBoothItems(boothData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching booth data:', error);
            setLoading(false);
        }
    };

    const fetchVoterData = async () => {
        if (boothValue && locationValue) {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://192.168.1.24:8000/api/get_voter_current_location_details_by_booth/booth_id/${boothValue}/city_id/${locationValue}/`
                );
                setVoterData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching voter data:', error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchVoterData();
    }, [boothValue, locationValue]);

    const renderVoterItem = ({ item }) => (
        <View style={styles.voterItem}>
            <Text style={styles.voterText}>{language === 'en' ? 'ID' : 'आईडी'}: {item.voter_id}</Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Name' : 'नाव'}: {language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Contact' : 'संपर्क'}:
                {item.voter_contact_number ? item.voter_contact_number : 'N/A'}
            </Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Location' : 'स्थान'}:
                {item.voter_current_location ? item.voter_current_location : 'N/A'}
            </Text>
        </View>
    );

    const filteredVoterData = voterData.filter((voter) =>
        voter.voter_name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    data={boothItems}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={language === 'en' ? 'Select Booth' : 'बूथ निवडा'}
                    searchPlaceholder={language === 'en' ? 'Search Booth' : 'बूथ शोधा'}
                    value={boothValue}
                    onChange={(item) => setBoothValue(item.value)}
                />

                {boothValue && (
                    <Dropdown
                        style={styles.dropdown}
                        containerStyle={styles.dropdownContainer}
                        data={locationItems}
                        labelField="label"
                        valueField="value"
                        placeholder={language === 'en' ? 'Select Location' : 'स्थान निवडा'}
                        value={locationValue}
                        onChange={(item) => setLocationValue(item.value)}
                    />
                )}

                {boothValue && locationValue && (
                    <TextInput
                        style={styles.searchBar}
                        placeholder={language === 'en' ? 'search by voter’s name or ID' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                )}
                <FlatList
                    data={filteredVoterData}
                    keyExtractor={(item) => item.voter_id.toString()}
                    renderItem={renderVoterItem}
                    ListHeaderComponent={loading && <LoadingListComponent />}
                    ListEmptyComponent={!loading && <EmptyListComponent />}
                />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    contentContainer: {
        flex: 1,
    },
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'black',
    },
    dropdownContainer: {
        width: '90%',
        borderColor: '#9095A1',
        borderRadius: 8,
    },
    searchBar: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
        marginVertical: 10,
        borderColor: 'black',
    },
    voterItem: {
        padding: 10,
        borderWidth: 0.5,
        marginVertical: 5,
        borderRadius: 5,
        borderColor: '#9095A1',
    },
    voterText: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#9095A1',
    },
});
