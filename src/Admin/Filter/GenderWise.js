import { Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { ActivityIndicator } from 'react-native-paper';
import VoterDetailsPopUp from '../Voters/VoterDetailsPopUp';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';

const { width, height } = Dimensions.get('window');

export default function GenderWise() {

    const { language } = useContext(LanguageContext);
    const [openGender, setOpenGender] = useState(false);
    const [genderValue, setGenderValue] = useState(null);
    const [genderItems, setGenderItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://192.168.1.38:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };

    const handleVoterPress = (voter_id) => {
        fetchVoterDetails(voter_id);
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        setupGenderOptions();
    }, []);

    useEffect(() => {
        if (genderValue) {
            fetchVoters(genderValue);
        }
    }, [genderValue]);

    const setupGenderOptions = () => {
        const genders = [
            { label: language === 'en' ? 'Male' : 'पुरुष', value: 'male' },
            { label: language === 'en' ? 'Female' : 'स्त्री', value: 'female' },
        ];
        setGenderItems(genders);
    };

    const fetchVoters = async (genderValue) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://192.168.1.38:8000/api/get_male_female_voters_by_all/gender/${genderValue}/`);
            setFilteredVoters(response.data);
            setLoading(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch voters. Please try again.');
            setLoading(false);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <DropDownPicker
                    open={openGender}
                    value={genderValue}
                    items={genderItems}
                    setOpen={setOpenGender}
                    setValue={setGenderValue}
                    setItems={setGenderItems}
                    placeholder={language === 'en' ? 'Select Gender' : 'लिंग निवडा'}
                    searchable={true}
                    searchPlaceholder={language === 'en' ? 'Search Gender' : 'लिंग शोधा'}
                    placeholderStyle={styles.placeholder}
                    style={styles.dropdown}
                    searchTextInputStyle={styles.searchTextInput}
                    containerStyle={styles.dropdownContainer}
                    dropDownContainerStyle={[styles.dropdownMenu, { zIndex: 999 }]}
                    maxHeight={200}
                />

                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredVoters}
                        keyExtractor={item => item.voter_id.toString()}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={!openGender}
                        renderItem={({ item, index }) => (
                            <Pressable style={styles.voterItem} onPress={() => { handleVoterPress(item.voter_id) }}>
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
                            </Pressable>
                        )}
                        ListHeaderComponent={loading && genderValue && <LoadingListComponent />}
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />

                    <VoterDetailsPopUp
                        isModalVisible={isModalVisible}
                        selectedVoter={selectedVoter}
                        setIsModalVisible={setIsModalVisible}
                    />
                </View>

            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: 'white'
    },
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#9095A1',
    },
    dropdownContainer: {
        width: '100%',
    },
    dropdownMenu: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#9095A1',
        paddingTop: '6%',
    },
    searchTextInput: {
        borderColor: '#9095A1',
        borderRadius: 4,
    },
    placeholder: {
        color: '#9095A1',
        marginLeft: 15,
    },
    listContainer: {
        flex: 1,
    },
    voterItem: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: '#9095A1',
        backgroundColor: 'white',
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
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#9095A1',
    },
});
