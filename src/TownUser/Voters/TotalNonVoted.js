import { ActivityIndicator, Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import React, { useContext, useEffect, useState, memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import axios from 'axios';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import { toTitleCase } from '../../ReusableCompo/Functions/toTitleCaseConvertor';
const { width, height } = Dimensions.get('screen');



const TotalNonVoted = () => {
    const { userId } = useContext(TownUserContext);
    const { language } = useContext(LanguageContext);
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [voters, setVoters] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);

    const searchedVoter = voters.filter(voter => {
        const boothId = voter.voter_id ? voter.voter_id.toString().toLowerCase() : '';
        const boothName = voter.voter_name ? voter.voter_name.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();
        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.38:8000/api/town_user_id/${userId}/confirmation/2/`);
            setVoters(response.data);
        } catch (error) {
            const message = error.response ? error.response.data.message : 'Error fetching data';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const fetchVoterDetails = async (voter_id) => {
        try {
            const response = await axios.get(`http://192.168.1.38:8000/api/voters/${voter_id}`);
            setSelectedVoter(response.data);
            setIsModalVisible(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Retry" onPress={fetchData} />
            </View>
        );
    }
    const renderItem = ({ item, onPress, index }) => {
        let backgroundColor = 'white';

        if (item.voter_favour_id === 1) {
            backgroundColor = '#d3f5d3';
        } else if (item.voter_favour_id === 2) {
            backgroundColor = '#f5d3d3';
        } else if (item.voter_favour_id === 3) {
            backgroundColor = '#f5f2d3';
        } else if (item.voter_favour_id === 4) {
            backgroundColor = '#c9daff';
        } else if (item.voter_favour_id === 5) {
            backgroundColor = 'skyblue';
        } else if (item.voter_favour_id === 6) {
            backgroundColor = '#fcacec';
        } else if (item.voter_favour_id === 7) {
            backgroundColor = '#dcacfa';
        }

        return (
            <Pressable style={[styles.voterItem, { backgroundColor }]}
                onPress={() => fetchVoterDetails(item.voter_id)}>
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
            </Pressable >
        )
    }


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchedValue}
                    onChangeText={setSearchValue}
                    placeholder={language === 'en' ? 'Search by voter’s name or Id' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
                    style={styles.searchInput}
                />
            </View>


            <View style={styles.listContainer}>
                <FlatList
                    data={searchedVoter}
                    keyExtractor={item => item.voter_id.toString()}
                    showsVerticalScrollIndicator={true}
                    renderItem={renderItem}
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
    );
};

export default TotalNonVoted;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: height * 0.86,
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
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10
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
        borderWidth: 0.1,
        borderRadius: 1,
        columnGap: width * 0.03
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
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
