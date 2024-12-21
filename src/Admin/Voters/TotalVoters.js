import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Pressable, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { LanguageContext } from '../../LanguageContext';
import VoterDetailsPopUp from './VoterDetailsPopUp';
import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { closeDatabase, createTotalVotersBGTable, getVotersFromTotalVotersBGTable, getVotersFromTotalVotersTable, insertTotalVoter } from './SQLiteHelper';
import WashimVoterContext from '../Context_Api/WashimVoterContext';
import { toTitleCase } from '../ReusableCompo/ToTitleCase';

const { width, height } = Dimensions.get('screen');

const Totalvoters = () => {
    const [voters, setVoters] = useState([]);
    const { washimVoters } = useContext(WashimVoterContext);
    const [totalVoters, setTotalVoters] = useState('00000');
    const { language } = useContext(LanguageContext);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchVoterDetails = (voter_id) => {
        const searchedVoter = washimVoters.find(voter => voter.voter_id === voter_id);
        console.log("Search voter :: ", searchedVoter);
        setSelectedVoter(searchedVoter);
        // axios.get(`http://4.172.246.116:8000/api/voters/${voter_id}`)
        //     .then(response => {
        //         setSelectedVoter(response.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching voter details:', error);
        //         Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
        //     });
    };


    const searchedVoter = washimVoters.filter(voter =>
        (voter.voter_name && voter.voter_name.toLowerCase().includes(searchText.toLowerCase())) ||
        (voter.voter_name_mar && voter.voter_name_mar.toLowerCase().includes(searchText.toLowerCase())) ||
        (voter.voter_id_card_number && voter.voter_id_card_number.toLowerCase().includes(searchText.toLowerCase())) ||
        (voter.voter_serial_number && voter.voter_serial_number.toString().includes(searchText))

    );

    useEffect(() => {
        setFilteredVoters(searchedVoter);
    }, [searchText, washimVoters]);

    // Edit voter form handler
    const handleVoterEditForm = (voter_id) => {
        fetchVoterDetails(voter_id);
        setIsModalVisible(true);
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
                <TouchableOpacity onPress={() => handleVoterEditForm(item.voter_id)}
                    style={{ alignItems: 'center' }}>
                    <FontAwesome name="square-whatsapp" size={30} color="green" />
                    <Text style={{ fontSize: 12 }}>Share</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const fetchVotersData = async () => {
        // await dropTotalVotersTable();
        // await closeDatabase();

        try {
            setLoading(true);
            const allRows = await getVotersFromTotalVotersBGTable();
            console.log("All Total rows length :: ", allRows.length);
            setVoters(allRows);

            const response = await axios.get(`http://4.172.246.116:8000/api/total_voters/`)
            const result = response.data;
            setVoters(result);
            console.log("Voters data :: ", result.length);

            insertTotalVoter(result);
        } catch (error) {
            console.error("Error :: ", error);
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
        } finally {
            setLoading(false);
            await closeDatabase();
        }
        setLoading(false);
    }

    const getTotalVotersCount = async () => {
        try {
            axios.get('http://4.172.246.116:8000/api/voter_count')
                .then(response => {
                    console.log(response.data.count);
                    setTotalVoters(response.data.count);
                })
                .catch(error => {
                    console.error('Error fetching total voters count:', error);
                });
        } catch (error) {
            console.error('Error fetching total voters count:', error);
        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        //     fetchVotersData();
        getTotalVotersCount();
        setRefreshing(false);
    };



    useEffect(() => {
        if (washimVoters.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
        // fetchVotersData();
        setTotalVoters(washimVoters.length);
        getTotalVotersCount();
    }, [washimVoters]);


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>
                    {language === 'en' ? 'Washim Nagar Parishad' : 'वाशिम नगरपरिषद'}
                </Text>
                <Pressable style={{
                    height: height * 0.06,
                    borderRadius: 10,
                    width: '100%',
                }}>
                    <LinearGradient
                        colors={['#3C4CAC', '#F04393']}
                        locations={[0.3, 1]}
                        style={styles.gradient}
                    >
                        <Text style={styles.gradientText}>
                            {language === 'en' ? 'Total Voters' : 'एकूण मतदार संख्या'}
                        </Text>
                        <Text style={styles.gradientText}>{totalVoters || washimVoters.length}</Text>
                    </LinearGradient>
                </Pressable>
            </View>

            <TextInput
                style={styles.searchBar}
                placeholder={language === 'en' ? 'Search by voter Sr.No, Name or ID ' : 'मतदाराचे अनुक्रमांका, नाव किंवा आयडी द्वारे शोधा'}
                value={searchText}
                onChangeText={text => setSearchText(text)}
            />


            <FlatList
                data={filteredVoters}
                keyExtractor={item => item.voter_id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#3C4CAC']}
                    />
                }
                ListHeaderComponent={loading &&
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'small'} color='black' />
                        <Text style={{ color: 'black' }}>{language === 'en' ? 'Loading voters...' : 'लोडिंग मतदार...'}</Text>
                    </View>
                }
                ListEmptyComponent={!loading &&
                    <Text style={{ color: 'black', fontSize: 17, textAlign: 'center' }}>
                        {language === 'en' ? 'No Voters Found' : 'मतदार उपलब्ध नाही'}
                    </Text>
                }
            />
            <VoterDetailsPopUp
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                selectedVoter={selectedVoter}
            />
        </View>
    );
};

export default Totalvoters;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    headerContainer: {
        height: height * 0.08,
        width: "100%",
        justifyContent: 'center',
        // backgroundColor: 'green',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#3C4CAC',
        // backgroundColor: 'yellow',
    },
    gradient: {
        height: '100%',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    gradientText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        width: "100%",
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: '3%',
        marginTop: 15,
        backgroundColor: '#fff',
        alignSelf: 'center',
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
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
    },
    voterCountContainer: {
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updatedVotersText: {
        color: '#43eb34',
        fontSize: height * 0.025,
        fontWeight: 'bold',
    },
    remainingVotersText: {
        color: '#f2fc28',
        fontSize: height * 0.025,
        fontWeight: 'bold',
        marginTop: 5,
    },
    itemContainer: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    voterRecord: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    idSection: {
        width: '20%',
        borderRightWidth: 1,
        borderRightColor: 'black',
        paddingRight: 10,
        alignItems: 'center',
    },
    nameSection: {
        flex: 1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemText: {
        fontSize: height * 0.018,
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});
