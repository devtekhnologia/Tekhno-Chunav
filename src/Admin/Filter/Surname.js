import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Modal,
    Pressable,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Surname = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVoterIds, setSelectedVoterIds] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.1.24:8000/api/surname_wise_voter_count/');
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
            const filtered = data.filter((item) =>
                item.surname.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    const handlePress = async (surnameId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://192.168.1.24:8000/api/surname_wise_voter_count/${surnameId}`);
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

    const assignColorToSelectedVoters = async (colorId) => {
        try {
            const payload = {
                voter_ids: selectedVoterIds,
                voter_favour_id: colorId,
            };

            const response = await axios.put('http://192.168.1.24:8000/api/favour/', payload);
            if (response.status === 200) {
                Alert.alert('Success', 'Color assigned successfully!');
                setModalVisible(false);
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
                        <TouchableOpacity onPress={() => handlePress(item.surname_id)}>
                            <View style={styles.voterItem}>
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
