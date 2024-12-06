import { ActivityIndicator, Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import React, { useContext, useEffect, useState, memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import axios from 'axios';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
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


    const convertToCamel = (name) => {
        return newName = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.24:8000/api/town_user_id/${userId}/confirmation/2/`);
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
            const response = await axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`);
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

    const VoterItem = memo(({ item, index, onPress }) => (
        <Pressable style={styles.voterItem} onPress={onPress}>
            <Text style={styles.voterIdText}>{index}</Text>
            <Text style={{ flex: 1 }}>{language === 'en' ? convertToCamel(item.voter_name) : item.voter_name_mar}</Text>
        </Pressable>
    ));

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchedValue}
                    onChangeText={setSearchValue}
                    placeholder={language === 'en' ? 'search by voter’s name or ID' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
                    style={styles.searchInput}
                />
            </View>


            <View style={styles.listContainer}>
                <>
                    <FlatList
                        data={searchedVoter}
                        keyExtractor={item => item.voter_id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <VoterItem
                                item={item}
                                index={index + 1}
                                onPress={() => fetchVoterDetails(item.voter_id)}
                            />
                        )}
                        ListHeaderComponent={loading && <LoadingListComponent />}
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />
                    <VoterDetailsPopUp
                        isModalVisible={isModalVisible}
                        selectedVoter={selectedVoter}
                        setIsModalVisible={setIsModalVisible}
                    />
                </>

            </View>

        </View>
    );
};

export default TotalNonVoted;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
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
    voterIdText: {
        borderWidth: 1,
        borderColor: 'blue',
        // width: 50,
        paddingVertical: 2,
        paddingHorizontal: 5,
        textAlign: 'center',
        borderRadius: 3,
        fontWeight: '700',
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
