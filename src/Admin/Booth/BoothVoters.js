import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome6';
import VoterDetailsPopUp from '../Voters/VoterDetailsPopUp';
import { LanguageContext } from '../../LanguageContext';
import WashimVoterContext from '../Context_Api/WashimVoterContext';
import { toTitleCase } from '../ReusableCompo/ToTitleCase';

const { width, height } = Dimensions.get('screen');

const BoothVoters = ({ route }) => {
    const { language } = useContext(LanguageContext);
    const { washimVoters } = useContext(WashimVoterContext);
    const { boothId } = route.params;
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchedValue, setSearchValue] = useState('');
    const [sortState, setSortState] = useState(0);
    const [initialVoters, setInitialVoters] = useState([]);
    const [error, setError] = useState('')
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://4.172.246.116:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Error fetching voter details:', error);
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };


    const sortVotersAlphabetically = () => {
        if (sortState === 0) {

            const sortedVoters = [...filteredVoters].sort((a, b) => {
                const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
                const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
                return nameA.localeCompare(nameB);
            });
            setFilteredVoters(sortedVoters);
            setSortState(1);
        } else if (sortState === 1) {
            // Sort Z-A
            const sortedVoters = [...filteredVoters].sort((a, b) => {
                const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
                const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
                return nameB.localeCompare(nameA);
            });
            setFilteredVoters(sortedVoters);
            setSortState(2);
        } else {
            // Reset to default order (initial voters)
            setFilteredVoters(initialVoters);
            setSortState(0);
        }
    };

    const fetchBoothVoters = async () => {
        setLoading(true);
        const boothVoters = washimVoters.filter(voter => voter.booth_id === boothId);
        setFilteredVoters(boothVoters);
        setInitialVoters(boothVoters);
        setVoters(boothVoters);

        if (boothVoters.length === 0) {
            axios.get(`http://4.172.246.116:8000/api/get_voters_by_booth/${boothId}/`)
                .then(response => {
                    if (response.data && Array.isArray(response.data)) {
                        setVoters(response.data);
                        setFilteredVoters(response.data);
                        setInitialVoters(response.data);
                    } else {
                        setError('Unexpected API response format.');
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching voter data:', error);
                    setError('Error fetching data. Please try again later.');
                })
        }
        setLoading(false);
    };

    const searchedVoters = voters.filter(voter =>
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_name_mar && voter.voter_name_mar.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_id && voter.voter_id.toString().includes(searchedValue))
    );

    useEffect(() => {
        setFilteredVoters(searchedVoters);
    }, [searchedValue, voters]);

    useEffect(() => {
        fetchBoothVoters()
    }, [boothId]);

    const getIconName = () => {
        if (sortState === 0) {
            return "sort";
        } else if (sortState === 1) {
            return "sort-alpha-down";
        } else if (sortState === 2) {
            return "sort-alpha-up-alt";
        }
    };

    const renderItem = ({ item, index }) => {
        return (
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
                <TouchableOpacity onPress={() => fetchVoterDetails(item.voter_id)}
                    style={{ alignItems: 'center' }}>
                    <FontAwesome name="square-whatsapp" size={30} color="green" />
                    <Text style={{ fontSize: 12 }}>Share</Text>
                </TouchableOpacity>
            </View >
        );
    };


    return (
        <HeaderFooterLayout
            headerText={language === 'en' ? `Voters in Booth : ${route.params.boothId}` : `${route.params.boothId} : बूथमधील मतदार`}
            showHeader={true}
            showFooter={false}
            leftIcon={true}
            rightIcon={true}
            leftIconName="keyboard-backspace"
            rightIconName={getIconName()}
            onRightIconPress={sortVotersAlphabetically}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder=
                        {language === 'en' ? 'Search by voter’s name' : 'मतदाराचे नाव किंवा ओळखपत्राने शोधा'}
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredVoters}
                        keyExtractor={item => item.voter_id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        ListEmptyComponent={!loading && (
                            <Text>{language === 'en' ? 'No results found' : 'कोणतेही परिणाम आढळले नाहीत'}</Text>
                        )}
                        ListHeaderComponent={loading &&
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size={'small'} />
                                <Text>
                                    {language === 'en' ? 'Loading...' : 'लोड करत आहे...'}
                                </Text>
                            </View>
                        }
                    />

                    <VoterDetailsPopUp
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        selectedVoter={selectedVoter}
                    />
                </View>
            </View>
        </HeaderFooterLayout>
    );
};

export default BoothVoters;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: '100%',
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1.5,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        columnGap: 20,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    selectionToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    actionIcon: {
        paddingHorizontal: 15,
    },
    listContainer: {
        flex: 1,
    },
    voterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: 'gray',
        columnGap: 15
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
        fontWeight: '900',
        color: '#333',
        textAlign: 'center',
    },
    selectedVoterItem: {
        backgroundColor: '#e0f7fa',
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
