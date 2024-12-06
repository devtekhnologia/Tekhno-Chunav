import { Alert, Dimensions, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EditVoterForm from '../../ReusableCompo/EditVoterForm';
import { TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('screen');

const BoothVoters = ({ route }) => {
    const { boothId } = route.params;
    const [voters, setVoters] = useState([]);
    const { language } = useContext(LanguageContext);

    const [filteredVoters, setFilteredVoters] = useState([]);
    const [searchedValue, setSearchValue] = useState('');
    const [error, setError] = useState(null);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isFormVisible, setFormVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
                setFormVisible(true);
            })
            .catch(error => {
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };

    const handleVoterPress = (voter_id) => {
        fetchVoterDetails(voter_id);
    };


    const serchedVoter = voters.filter(voter =>
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_name_mar && voter.voter_name_mar.toLowerCase().includes(searchedValue.toLowerCase())) ||
        (voter.voter_id && voter.voter_id.toString().includes(searchedValue))
    );

    useEffect(() => {
        setFilteredVoters(serchedVoter);
    }, [searchedValue, voters]);

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const getBoothVoters = async () => {
        setRefreshing(true)
        axios.get(`http://192.168.1.24:8000/api/get_voters_by_booth/${boothId}/`)
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    setVoters(response.data);
                } else {
                    setError('Unexpected API response format.');
                }
                setRefreshing(false);
            })
            .catch(error => {
                Alert.alert('Error fetching voter data:', error.toString ? error.toString() : 'Unknown error');
                setError('Error fetching data. Please try again later.');
                BottomBoothsStack(false);
            });
    }

    useEffect(() => {
        getBoothVoters()
    }, [boothId]);

    const handleRefresh = () => {
        setRefreshing(true);
        getBoothVoters();
        setRefreshing(false);
    };


    const handleVoterEditForm = (voter_id) => {
        fetchVoterDetails(voter_id);
        setFormVisible(true);
    };

    const handleCloseEditForm = () => {
        setFormVisible(false);
        setSelectedVoter(null);
    };

    const handleSelectedVoterDetails = (newDetails) => {
        const updatedFilteredVoters = filteredVoters.map(voter =>
            voter.voter_id.toString() === newDetails.voter_id.toString() ? { ...voter, ...newDetails } : voter
        );
        setFilteredVoters(updatedFilteredVoters);
    };

    const renderItem = ({ item, index }) => {
        let backgroundColor = 'white';

        switch (item.voter_favour_id) {
            case 1:
                backgroundColor = '#d3f5d3';
                break;
            case 2:
                backgroundColor = '#f5d3d3';
                break;
            case 3:
                backgroundColor = '#f5f2d3';
                break;
            case 4:
                backgroundColor = '#c9daff';
                break;
            case 5:
                backgroundColor = 'skyblue';
                break;
            case 6:
                backgroundColor = '#fcacec';
                break;
            case 7:
                backgroundColor = '#dcacfa';
                break;

            default:
                backgroundColor = 'white';
        }

        return (
            <TouchableOpacity style={[styles.voterItem, { backgroundColor }]} onPress={() => handleVoterEditForm(item.voter_id)}>
                <View style={styles.idSection}>
                    <Text style={styles.itemText}>{index + 1}</Text>
                </View>
                <View style={styles.nameSection}>
                    <Text style={styles.itemText}>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchedValue}
                    onChangeText={text => setSearchValue(text)}
                    placeholder={language === 'en' ? 'Search by voter’s name or Id' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
                    style={styles.searchInput}
                />
            </View>

            < FlatList
                data={filteredVoters}
                keyExtractor={item => item.voter_id.toString()}
                showsVerticalScrollIndicator={true}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                renderItem={renderItem}
                ListHeaderComponent={refreshing && <LoadingListComponent />}
                ListEmptyComponent={!refreshing && <EmptyListComponent />}
            />


            <EditVoterForm
                isVisible={isFormVisible}
                onClose={handleCloseEditForm}
                selectedVoter={selectedVoter}
                onEditVoter={handleSelectedVoterDetails}
            />
        </View >
    )
}

export default BoothVoters

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: height * 0.79,
        backgroundColor: 'white'
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
        flex: 1,
        backgroundColor: 'white'
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
        flexDirection: 'row',
        gap: 10
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: 'gray',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
    },
    idSection: {
        width: '20%',
        borderRightWidth: 1,
        borderRightColor: 'black',
        paddingRight: 10,
        alignItems: 'center',
    },
    nameSection: {
        width: '80%',
        paddingLeft: 10,
    },
    itemText: {
        fontSize: height * 0.018,
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});
