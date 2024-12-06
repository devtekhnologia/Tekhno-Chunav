import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Alert, RefreshControl, Modal } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import EditVoterForm from '../../ReusableCompo/EditVoterForm';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { width, height } = Dimensions.get('screen');

const Totalvoters = () => {
    const { language } = useContext(LanguageContext);
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [updatedVoters, setUpdatedVoters] = useState(0);
    const [remainingVoters, setRemainingVoters] = useState(0);
    const [sortState, setSortState] = useState(0);
    const [initialVoters, setInitialVoters] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedVoters, setSelectedVoters] = useState([]);
    const [isSelectionMode, setSelectionMode] = useState(false);
    const [selectAllActive, setSelectAllActive] = useState(false);
    const [isCasteModalVisible, setCasteModalVisible] = useState(false);
    const [casteInput, setCasteInput] = useState('');
    const [castes, setCastes] = useState([]);
    const [selectedCasteId, setSelectedCasteId] = useState(null);

    const fetchVoterDetails = async (voter_id) => {
        try {
            const response = await axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`);
            setSelectedVoter(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);

        const searchTerms = text.toLowerCase().trim().split(/\s+/);

        const filtered = voters.filter(voter => {
            const searchFields = [
                voter.voter_id.toString(),
                voter.voter_name ? voter.voter_name.toLowerCase() : '',
                voter.voter_name_mar ? voter.voter_name_mar.toLowerCase() : ''
            ];

            return searchTerms.every(term =>
                searchFields.some(field => field.includes(term))
            );
        });

        setFilteredVoters(filtered);

        if (selectAllActive) {
            setSelectedVoters(filtered.map(voter => voter.voter_id));
        }
    };


    const handleVoterEditForm = (voter_id) => {
        if (isSelectionMode) {
            toggleVoterSelection(voter_id);
        } else {
            fetchVoterDetails(voter_id);
            setFormVisible(true);
        }
    };

    const handleSelectedVoterDetails = (newDetails) => {
        const updatedFilteredVoters = filteredVoters.map(voter =>
            voter.voter_id.toString() === newDetails.voter_id.toString() ? { ...voter, ...newDetails } : voter
        );
        setFilteredVoters(updatedFilteredVoters);
    };

    const handleCloseEditForm = () => {
        setFormVisible(false);
        setSelectedVoter(null);
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const fetchVoterData = async () => {
        setLoading(true);
        try {
            // const response = await axios.get(`http://192.168.1.24:8000/api/town_wise_voter_list/139/`);
            const response = await axios.get(`http://192.168.1.24:8000/api/total_voters/`);
            const votersData = response.data;
            setVoters(votersData);
            setFilteredVoters(votersData);
            setInitialVoters(votersData);
        } catch (error) {
            Alert.alert('Error fetching voters data:', error.toString ? error.toString() : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };
    const fetchCastData = async () => {
        try {
            const response = await axios.get('http://192.168.1.24:8000/api/cast/');
            setCastes(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch caste data.');
        }
    };

    const fetchVoterCounts = async () => {
        try {
            const response = await axios.get('http://192.168.1.24:8000/api/voter_updated_counts/');
            const { updated_count, remaining_count } = response.data;
            setUpdatedVoters(updated_count);
            setRemainingVoters(remaining_count);
        } catch (error) {
            Alert.alert('Error fetching voter counts:', error.toString ? error.toString() : 'Unknown error');
        }
    };

    useEffect(() => {
        fetchVoterData();
        fetchVoterCounts();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchVoterData();
        await fetchVoterCounts();
        setRefreshing(false);
    };


    const toggleVoterSelection = (voter_id) => {
        if (selectedVoters.includes(voter_id)) {
            setSelectedVoters(selectedVoters.filter(id => id !== voter_id));
        } else {
            setSelectedVoters([...selectedVoters, voter_id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectAllActive) {
            setSelectedVoters([]);
            setSelectAllActive(false);
        } else {
            const visibleVoterIds = filteredVoters.map(voter => voter.voter_id);
            setSelectedVoters(visibleVoterIds);
            setSelectAllActive(true);
        }
    };

    const handleLongPress = (voter_id) => {
        if (!isSelectionMode) {
            setSelectionMode(true);
        }
        toggleVoterSelection(voter_id);
    };

    const exitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedVoters([]);
        setSelectAllActive(false);
    };

    const assignColorToSelectedVoters = async (colorId) => {
        try {
            const payload = {
                voter_ids: selectedVoters,
                voter_favour_id: colorId,
            };

            const response = await axios.put('http://192.168.1.24:8000/api/favour/', payload);
            if (response.status === 200) {
                const updatedVoters = filteredVoters.map(voter =>
                    selectedVoters.includes(voter.voter_id)
                        ? { ...voter, voter_favour_id: colorId }
                        : voter
                );
                setFilteredVoters(updatedVoters);
                exitSelectionMode();
                Alert.alert('Success', 'Color assigned successfully!');
            } else {
                throw new Error('Failed to update colors. Please try again.');
            }
        } catch (error) {
            console.error('Error assigning color:', error.message);
            Alert.alert('Error', 'Failed to assign color. Please try again.');
        }
    };

    const renderCasteItem = ({ item }) => (
        <TouchableOpacity
            style={styles.casteItem}
            onPress={() => setSelectedCasteId(item.cast_id)}
        >
            <Text style={styles.casteText}>{`${item.cast_id} - ${item.cast_name}`}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        let backgroundColor = 'white';
        switch (item.voter_favour_id) {
            case 1: backgroundColor = '#d3f5d3'; break;
            case 2: backgroundColor = '#f5d3d3'; break;
            case 3: backgroundColor = '#f5f2d3'; break;
            case 4: backgroundColor = '#c9daff'; break;
            case 5: backgroundColor = 'skyblue'; break;
            case 6: backgroundColor = '#fcacec'; break;
            case 7: backgroundColor = '#dcacfa'; break;
            default: backgroundColor = 'white';
        }

        const isSelected = selectedVoters.includes(item.voter_id);
        return (
            <TouchableOpacity
                style={[
                    styles.itemContainer,
                    {
                        backgroundColor,
                        borderColor: isSelected ? 'black' : 'gray',
                        borderWidth: isSelected ? 2 : 0.5
                    }
                ]}
                onPress={() => handleVoterEditForm(item.voter_id)}
                onLongPress={() => handleLongPress(item.voter_id)}
            >
                <View style={styles.idSection}>
                    <Text style={styles.itemText}>{item.voter_id}</Text>
                </View>
                <View style={styles.nameSection}>
                    <Text style={styles.itemText}>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
                </View>
            </TouchableOpacity>
        );
    };


    const assignCasteToSelectedVoters = async () => {
        if (!selectedCasteId) {
            Alert.alert('Error', 'Please select a caste.');
            return;
        }

        if (selectedVoters.length === 0) {
            Alert.alert('Error', 'Please select at least one voter.');
            return;
        }

        try {
            const payload = {
                voter_ids: selectedVoters,
                voter_cast_id: selectedCasteId,
            };

            const response = await axios.post('http://192.168.1.24:8000/api/assign_voter_cast/', payload);
            if (response.status === 200) {
                Alert.alert('Success', 'Caste assigned successfully!');
                setCasteModalVisible(false);
                setSelectedCasteId(null);
                setSelectedVoters([]);
                setSelectionMode(false);
            } else {
                throw new Error('Failed to assign caste.');
            }
        } catch (error) {
            console.error('Error assigning caste:', error.message);
            Alert.alert('Error', 'Failed to assign caste. Please try again.');
        }
    };


    return (
        <View style={styles.container}>
            <LinearGradient colors={['#3C4CAC', '#F04393']} locations={[0.3, 1]} style={styles.gradient}>
                <TextInput
                    style={styles.searchBar}
                    placeholder={language === 'en' ? 'Search by voter’s name' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
                    value={searchText}
                    onChangeText={handleSearch}
                />
                <View style={styles.voterCountContainer}>
                    <Text style={styles.updatedVotersText}>{language === 'en' ? 'Updated Voters' : 'अपडेट झालेले मतदार :'} {updatedVoters}</Text>
                    <Text style={styles.remainingVotersText}>{language === 'en' ? 'Remaining Voters' : 'उरलेले मतदार :'} {remainingVoters}</Text>
                </View>
            </LinearGradient>

            {isSelectionMode && (
                <View style={styles.colorAssignmentContainer}>
                    <TouchableOpacity style={styles.assignCasteButton} onPress={() => { setCasteModalVisible(true); fetchCastData(); }}>
                        <Text style={styles.assignCasteButtonText}>{language === 'en' ? 'Assign Caste' : 'जात नियुक्त करा'}</Text>
                    </TouchableOpacity>
                    <View style={styles.colorButtonsRow}>
                        <TouchableOpacity style={styles.colorButton} onPress={() => exitSelectionMode()}>
                            <Text style={[styles.exitText, { fontSize: 20 }]}>✖</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={() => assignColorToSelectedVoters(0)}>
                            <Text style={[styles.colorText, { backgroundColor: 'black' }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={() => assignColorToSelectedVoters(1)}>
                            <Text style={[styles.colorText, { backgroundColor: '#31de3f' }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={() => assignColorToSelectedVoters(2)}>
                            <Text style={[styles.colorText, { backgroundColor: '#fa5750' }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={() => assignColorToSelectedVoters(3)}>
                            <Text style={[styles.colorText, { backgroundColor: '#f0ec24' }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={() => assignColorToSelectedVoters(4)}>
                            <Text style={[styles.colorText, { backgroundColor: '#5459f0' }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={() => assignColorToSelectedVoters(5)}>
                            <Text style={[styles.colorText, { backgroundColor: 'skyblue' }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={() => assignColorToSelectedVoters(6)}>
                            <Text style={[styles.colorText, { backgroundColor: '#f24bdc' }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={() => assignColorToSelectedVoters(7)}>
                            <Text style={[styles.colorText, { backgroundColor: '#c631eb' }]}></Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.colorButton} onPress={toggleSelectAll}>
                            <Text style={styles.selectAllText}>{selectAllActive ? 'Deselect All' : 'Select All'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {loading ? (
                <LoadingListComponent />
            ) : (
                <FlatList
                    data={filteredVoters}
                    keyExtractor={item => item.voter_id.toString()}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3C4CAC']} />}
                    contentContainerStyle={styles.flatListContent}
                    ListHeaderComponent={loading && <LoadingListComponent />}
                    ListEmptyComponent={!loading && <EmptyListComponent />}

                />
            )}

            {isFormVisible && (
                <EditVoterForm
                    isVisible={isFormVisible}
                    onClose={handleCloseEditForm}
                    selectedVoter={selectedVoter}
                    onEditVoter={handleSelectedVoterDetails}
                />
            )}

            <Modal visible={isCasteModalVisible} transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            {language === 'en' ? 'Assign Caste' : 'जात नियुक्त करा'}
                        </Text>
                        <View style={styles.listContainer}>
                            <FlatList
                                data={castes}
                                keyExtractor={(item) => item.cast_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.casteItem,
                                            selectedCasteId === item.cast_id && styles.selectedCasteItem,
                                        ]}
                                        onPress={() => setSelectedCasteId(item.cast_id)}
                                    >
                                        <Text style={styles.casteName}
                                        >
                                            {`${item.cast_id}. ${item.cast_name}`}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={assignCasteToSelectedVoters}
                        >
                            <Text style={styles.modalButtonText}>
                                {language === 'en' ? 'Submit' : 'प्रस्तुत करा'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setCasteModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>
                                {language === 'en' ? 'Cancel' : 'रद्द करा'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    );
};

export default Totalvoters;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },
    gradient: {
        paddingHorizontal: 10,
        borderRadius: 10,
        paddingVertical: 5,
    },
    loadingContainer: {
        height: '100%',
        paddingVertical: 20,
        alignItems: 'center',
    },
    searchBar: {
        width: "100%",
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: '5%',
        backgroundColor: '#fff',
        alignSelf: 'center',
    },
    voterCountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
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
    colorAssignmentContainer: {
        marginTop: 10,
        paddingHorizontal: 1,
        paddingBottom: 15,
    },
    colorButtonsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorButton: {
        padding: '1.5%',
        borderRadius: 5,
    },
    colorText: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    assignCasteButton: {
        width: '60%',
        height: 40,
        backgroundColor: '#3C4CAC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 'auto'
    },
    assignCasteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',

    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    listContainer: {
        maxHeight: 250,
        width: '100%',
    },
    casteList: {
        maxHeight: 200,
        width: '100%',
    },
    casteItem: {
        paddingVertical: 5,
        paddingLeft: 5,
        width: '100%',
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedCasteItem: {
        // backgroundColor: '#3C4CAC',
        borderColor: '#3C4CAC',
    },
    casteName: {
        fontSize: 16,
        color: 'black',
    },
    modalButton: {
        marginTop: 10,
        backgroundColor: '#3C4CAC',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#F04393',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
