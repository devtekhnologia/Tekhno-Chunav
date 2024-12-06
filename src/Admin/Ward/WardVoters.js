import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import VoterDetailsPopUp from '../Voters/VoterDetailsPopUp';
import { useNavigation } from '@react-navigation/native';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { width, height } = Dimensions.get('screen');

const WardVoters = ({ route }) => {
    const { language } = useContext(LanguageContext);
    const { wardId } = route.params;

    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedValue, setSearchValue] = useState('');
    const [sortState, setSortState] = useState(0);
    const [initialVoters, setInitialVoters] = useState([]);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVoters, setSelectedVoters] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const fetchVoters = async () => {
            try {
                const response = await axios.get(`http://192.168.1.24:8000/api/get_voters_by_prabhagh/${wardId}/`);
                if (Array.isArray(response.data)) {
                    setVoters(response.data);
                    setFilteredVoters(response.data);
                    setInitialVoters(response.data);
                } else {
                    throw new Error('Unexpected API response format.');
                }
            } catch (error) {
                Alert.alert('Error', 'Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchVoters();
    }, [wardId]);

    useEffect(() => {
        const searchedVoters = voters.filter(voter =>
            voter.voter_name?.toLowerCase().includes(searchedValue.toLowerCase()) ||
            voter.voter_id?.toString().includes(searchedValue)
        );
        setFilteredVoters(searchedVoters);
    }, [searchedValue, voters]);

    const sortVoters = () => {
        const newSortState = (sortState + 1) % 3;
        const sortedVoters = [...filteredVoters].sort((a, b) => {
            const nameA = a.voter_name?.toLowerCase() || '';
            const nameB = b.voter_name?.toLowerCase() || '';
            return newSortState === 1 ? nameA.localeCompare(nameB) : newSortState === 2 ? nameB.localeCompare(nameA) : 0;
        });
        setFilteredVoters(newSortState === 0 ? initialVoters : sortedVoters);
        setSortState(newSortState);
    };

    const fetchVoterDetails = async (voter_id) => {
        try {
            const response = await axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`);
            setSelectedVoter(response.data);
            setIsModalVisible(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
        }
    };

    const toggleVoterSelection = (voter_id) => {
        setSelectedVoters((prev) =>
            prev.includes(voter_id) ? prev.filter(id => id !== voter_id) : [...prev, voter_id]
        );
    };

    const handleVoterPress = (voter_id) => {
        isSelectionMode ? toggleVoterSelection(voter_id) : fetchVoterDetails(voter_id);
    };

    const handleLongPress = (voter_id) => {
        setIsSelectionMode(true);
        toggleVoterSelection(voter_id);
    };


    const getIconName = () => {
        return sortState === 0 ? "sort" : sortState === 1 ? "sort-alpha-down" : "sort-alpha-up-alt";
    };

    const getBackgroundColor = (voter_favour_id) => {
        const colors = {
            1: '#d3f5d3',
            2: '#f5d3d3',
            3: '#f5f2d3',
            4: '#c9daff',
        };
        return colors[voter_favour_id] || 'white';
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };


    return (
        <HeaderFooterLayout
            headerText={language === 'en' ? `Voters in Ward: ${wardId}` : `${wardId}: प्रभाग मधील मतदार`}
            showHeader
            showFooter={false}
            leftIcon
            rightIcon
            leftIconName="keyboard-backspace"
            rightIconName={getIconName()}
            onRightIconPress={sortVoters}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={setSearchValue}
                        placeholder={language === 'en' ? 'Search by voter’s name' : 'मतदाराचे नाव किंवा ओळखपत्राने शोधा'}
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.listContainer}>
                    {loading ? <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" />
                        <Text>{language === 'en' ? 'Loading...' : 'लोड करत आहे...'}</Text>
                    </View> :
                        <FlatList
                            data={filteredVoters}
                            keyExtractor={item => item.voter_id.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[styles.voterItem, selectedVoters.includes(item.voter_id) && styles.selectedVoterItem, { backgroundColor: getBackgroundColor(item.voter_favour_id) }]}
                                    onPress={() => handleVoterPress(item.voter_id)}
                                >
                                    <View style={styles.voterDetails}>
                                        <Text style={styles.voterId}>{item.voter_id}</Text>
                                        <Text style={{ paddingLeft: 15, flex: 1 }}>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
                                    </View>
                                </Pressable>
                            )}
                            ListHeaderComponent={loading && <LoadingListComponent />}
                            ListEmptyComponent={!loading && <EmptyListComponent />} />
                    }
                    <VoterDetailsPopUp isModalVisible={isModalVisible} selectedVoter={selectedVoter} setIsModalVisible={setIsModalVisible} />
                </View>
            </View>
        </HeaderFooterLayout>
    );
};

export default WardVoters;

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
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10
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
    selectedVoterItem: {
        backgroundColor: '#e0f7fa',
    },
    voterDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    voterId: {
        width: 60,
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor: 'black',
        paddingRight: 10,
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
