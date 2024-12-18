import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Alert, Modal, Pressable, } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CastModal from '../Voters/CastModals';

const Surname = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSurnames, setSelectedSurnames] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedVoterIds, setSelectedVoterIds] = useState([]);
    const [isCasteModalVisible, setCasteModalVisible] = useState(false);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/surname_wise_voter_count/');
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data from the server.');
            setData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = data.filter((item) => {
                const surname = item.surname || ''; 
                return surname.toLowerCase().includes(query.toLowerCase());
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };
    

    const toggleSelection = (surnameId) => {
        if (selectedSurnames.includes(surnameId)) {
            setSelectedSurnames(selectedSurnames.filter((id) => id !== surnameId));
        } else {
            setSelectedSurnames([...selectedSurnames, surnameId]);
        }
    };

    const handleLongPress = (surnameId) => {
        setSelectionMode(true);
        toggleSelection(surnameId);
    };

    const handlePress = (surnameId) => {
        if (selectionMode) {
            toggleSelection(surnameId);
        } else {
            fetchVoterIds([surnameId]);
        }
    };

    const fetchVoterIds = async (surnameIds) => {
        if (!surnameIds.length) {
            Alert.alert('Error', 'Please select at least one surname.');
            return;
        }

        try {
            setLoading(true);
            const apiUrl = 'http://192.168.1.38:8000/api/surname_wise_voter_count/';
            const requestBody = { "surname_ids": surnameIds };

            const response = await axios.post(apiUrl, requestBody);
            const voterIds = response.data.voter_ids;

            await AsyncStorage.setItem('voter_ids', JSON.stringify(voterIds));
            setSelectedVoterIds(voterIds);
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching voter IDs:', error);
            Alert.alert('Error', 'Failed to fetch voter IDs.');
        } finally {
            setLoading(false);
        }
    };


    const assignCasteToVoters = async () => {
        if (!selectedSurnames.length) {
            Alert.alert('Error', 'No surnames selected.');
            return;
        }

        await fetchVoterIds(selectedSurnames);
        setCasteModalVisible(true);
    };

    const assignColorToSelectedVoters = async (colorId) => {
        try {
            const payload = {
                voter_ids: selectedVoterIds,
                voter_favour_id: colorId,
            };

            const response = await axios.put('http://192.168.1.38:8000/api/favour/', payload);
            if (response.status === 200) {
                Alert.alert('Success', 'Color assigned successfully!');
                setModalVisible(false);
                setSelectionMode(false);
                setSelectedSurnames([]);
            } else {
                throw new Error('Failed to update colors. Please try again.');
            }
        } catch (error) {
            console.error('Error assigning color:', error.message);
            Alert.alert('Error', 'Failed to assign color. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by Surname"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {selectionMode && (
                <View style={styles.selectionActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            setSelectionMode(false);
                            setSelectedSurnames([]);
                        }}
                    >
                        <Text style={styles.actionButtonText}>Exit Selection</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={assignCasteToVoters}
                    >
                        <Text style={styles.actionButtonText}>Assign Cast</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => fetchVoterIds(selectedSurnames)}
                    >
                        <Text style={styles.actionButtonText}>Assign Color</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) =>
                        item.surname_id ? item.surname_id.toString() : `index-${index}`
                    }
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => handlePress(item.surname_id)}
                            onLongPress={() => handleLongPress(item.surname_id)}
                        >
                            <View
                                style={[
                                    styles.voterItem,
                                    selectedSurnames.includes(item.surname_id) && styles.selectedItem,
                                ]}
                            >
                                <View style={styles.voterDetails}>
                                    <Text style={styles.index}>{index + 1}</Text>
                                    <View>
                                        <Text style={styles.voterName}>{item.surname || 'N/A'}</Text>
                                        <Text style={styles.voterMarathiName}>{item.count || 0}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select a Color</Text>

                        <View style={styles.colorOptions}>
                            <Pressable
                                style={[styles.colorButton, { backgroundColor: 'green' }]}
                                onPress={() => assignColorToSelectedVoters(1)}
                            />
                            <Pressable
                                style={[styles.colorButton, { backgroundColor: 'red' }]}
                                onPress={() => assignColorToSelectedVoters(2)}
                            />
                            <Pressable
                                style={[styles.colorButton, { backgroundColor: 'yellow' }]}
                                onPress={() => assignColorToSelectedVoters(3)}
                            />
                            <Pressable
                                style={[styles.colorButton, { backgroundColor: 'blue' }]}
                                onPress={() => assignColorToSelectedVoters(4)}
                            />
                        </View>

                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <CastModal
                isVisible={isCasteModalVisible}
                onClose={() => setCasteModalVisible(false)}
                selectedVoters={selectedVoterIds}
                onAssignCaste={(casteId) => {
                    setSelectedSurnames([]);
                    setSelectionMode(false);
                    console.log(`Assigned caste ID ${casteId} to voters`, selectedVoterIds);
                }}
            />
        </View>
    );
};

export default Surname;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: 'grey',
    },
    voterItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    voterDetails: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    index: {
        borderWidth: 1,
        borderColor: 'blue',
        width: 30,
        textAlign: 'center',
        borderRadius: 3,
        fontWeight: '700',
    },
    voterName: {
        fontSize: 18,
        fontWeight: '500',
    },
    voterMarathiName: {
        fontSize: 14,
        color: 'grey',
        fontWeight: '700',
    },
    selectedItem: {
        backgroundColor: '#a9aba9'
    },
    selectionActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    actionButton: {
        padding: 8,
        backgroundColor: 'blue',
        borderRadius: 4
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    colorOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
        width: '80%',
    },
    colorButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    closeButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f44336',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
