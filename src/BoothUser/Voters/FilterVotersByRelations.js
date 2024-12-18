import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import { TouchableOpacity } from 'react-native';
import LoadingModal from '../../ReusableCompo/LoadingModal';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const FilterVoterByRelations = ({ route }) => {
    const { relationId, ScreenName } = route.params;
    console.log(relationId, ScreenName);

    const { buserId } = useContext(BoothUserContext);
    console.log(buserId);

    const { language } = useContext(LanguageContext);
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [searchedValue, setSearchValue] = useState('');
    const [sortState, setSortState] = useState(0);
    const [initialVoters, setInitialVoters] = useState([]);
    const [error, setError] = useState('');
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchVoterDetails = (voter_id) => {
        setLoadingDetails(true);
        axios.get(`http://192.168.1.38:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            })
            .finally(() => setLoadingDetails(false));
    };

    useEffect(() => {
        const searchTerms = searchedValue.toLowerCase().trim().split(/\s+/);

        const filtered = voters.filter(voter => {
            const voterName = voter.voter_name ? voter.voter_name.toLowerCase() : '';
            const voterNameMar = voter.voter_name_mar ? voter.voter_name_mar.toLowerCase() : '';
            const voterId = voter.voter_id ? voter.voter_id.toString() : '';
            const voterSerialNumber = voter.voter_serial_number ? voter.voter_serial_number.toString() : '';
            const voterIdCardNumber = voter.voter_id_card_number ? voter.voter_id_card_number.toLowerCase() : '';

            return searchTerms.every(term =>
                voterName.includes(term) ||
                voterNameMar.includes(term) ||
                voterId.includes(term) ||
                voterSerialNumber.includes(term) ||
                voterIdCardNumber.includes(term)
            );
        });

        setFilteredVoters(filtered);
    }, [searchedValue, voters]);
    

    const sortVotersAlphabetically = () => {
        const sortedVoters = [...filteredVoters];
        if (sortState === 0) {
            sortedVoters.sort((a, b) => a.voter_name.toLowerCase().localeCompare(b.voter_name.toLowerCase()));
            setSortState(1);
        } else if (sortState === 1) {
            sortedVoters.sort((a, b) => b.voter_name.toLowerCase().localeCompare(a.voter_name.toLowerCase()));
            setSortState(2);
        } else {
            setFilteredVoters(initialVoters);
            setSortState(0);
        }
        setFilteredVoters(sortedVoters);
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`http://192.168.1.38:8000/api/get_voter_info/${buserId}/${relationId}/`)
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    setVoters(response.data);
                    setFilteredVoters(response.data);
                    setInitialVoters(response.data);
                } else {
                    setError('Unexpected API response format.');
                }
            })
            .catch(error => {
                Alert.alert('Error fetching voter data:', error.toString ? error.toString() : 'Unknown error');
                setError('Error fetching data. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, [buserId, relationId]);

    const getIconName = () => {
        if (sortState === 0) return 'sort';
        if (sortState === 1) return 'sort-alpha-down';
        if (sortState === 2) return 'sort-alpha-up-alt';
    };

    const toTitleCase = (str) => {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    const renderVoterItem = ({ item, index }) => {
        let color = 'transparent';
        switch (item.voter_favour_id) {
            case 1: color = '#d3f5d3'; break;
            case 2: color = '#fededd'; break;
            case 3: color = '#f8ff96'; break;
            case 4: color = '#6c96f0'; break;
            case 5: color = '#c5d7fc'; break;
            case 6: color = '#fcaef2'; break;
            case 7: color = '#c86dfc'; break;
            default: color = 'transparent'; break;
        }

        return (
            <TouchableOpacity style={[styles.voterItem, { backgroundColor: color }]} onPress={() => fetchVoterDetails(item.voter_id)}>
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
            </TouchableOpacity>
        );
    };

    return (
        <>
                    {loadingDetails && <LoadingModal />}

            <HeaderFooterLayout
                headerText={ScreenName}
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
                            placeholder={language === 'en' ? 'Search by name or ID' : 'आयडी किंवा नावाने शोधा'}
                            style={styles.searchInput}
                        />
                    </View>

                    <View style={styles.listContainer}>
                        <FlatList
                            data={filteredVoters}
                            keyExtractor={item => item.voter_id.toString()}
                            showsVerticalScrollIndicator={true}
                            renderItem={renderVoterItem}
                            ListHeaderComponent={loading && <LoadingListComponent />}
                            ListEmptyComponent={!loading && <EmptyListComponent />}
                        />

                        <VoterDetailsPopUp
                            isModalVisible={isModalVisible}
                            selectedVoter={selectedVoter}
                            setIsModalVisible={setIsModalVisible}
                        />
                    </View>
                </View>
            </HeaderFooterLayout>
        </>
    );
};

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
    listContainer: {
        flex: 0.99,
    },
    voterItem: {
        flex: 1,
        borderRadius: 2,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.2,
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
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FilterVoterByRelations;
