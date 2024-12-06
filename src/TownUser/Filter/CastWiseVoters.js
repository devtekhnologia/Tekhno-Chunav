import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import { TouchableOpacity } from 'react-native';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { height } = Dimensions.get('screen');

const CastWiseVoters = () => {
    const { userId } = useContext(TownUserContext);

    const [selectedCast, setSelectedCast] = useState(null);
    const [items, setItems] = useState([]);
    const [voters, setVoters] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCasteData = async () => {
        try {
            const response = await axios.get('http://192.168.1.24:8000/api/cast/');
            const casteData = response.data.map(cast => ({
                label: `${cast.cast_id} - ${cast.cast_name}`,
                value: cast.cast_id,
            }));
            setItems(casteData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load caste data');
        }
    };

    const fetVotersByCastwise = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://192.168.1.24:8000/api/get_voters_by_town_user_and_cast/${userId}/${selectedCast}/`);
            setVoters(response.data);
        } catch (error) {
            Alert.alert('Error fetching voters:', error.toString ? error.toString() : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        if (selectedCast) {
            fetVotersByCastwise();
        }
    }, [selectedCast]);

    useEffect(() => {
        fetchCasteData();
    }, []);

    const renderVoterItem = ({ item }) => (
        <View style={[styles.voterItem, { backgroundColor: item.color || '#FFFFFF' }]}>
            <TouchableOpacity style={styles.closeCircle} onPress={() => fetchVoterDetails(item.voter_id)}>
                <Text style={styles.voterText}>{item.voter_id} - {toTitleCase(item.voter_name)}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Dropdown
                data={items}
                labelField="label"
                valueField="value"
                value={selectedCast}
                onChange={item => setSelectedCast(item.value)}
                placeholder="Select Caste"
                containerStyle={styles.picker}
                style={styles.dropdown}
                dropdownStyle={styles.dropdownList}
                search
                searchPlaceholder="Search..."
            />



            {selectedCast && (
                <View style={styles.selectedCastContainer}>
                    <FlatList
                        data={voters}
                        keyExtractor={(item) => item.voter_id.toString()}
                        renderItem={renderVoterItem}
                        contentContainerStyle={styles.voterList}
                        ListHeaderComponent={loading && <LoadingListComponent />}
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />
                    <VoterDetailsPopUp
                        isModalVisible={isModalVisible}
                        selectedVoter={selectedVoter}
                        setIsModalVisible={setIsModalVisible}
                    />
                </View>
            )}
        </View>
    );
};

export default CastWiseVoters;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginVertical: 10,
        height: height * 0.774,
    },

    picker: {
        marginBottom: 10,
        backgroundColor: 'white',
    },
    dropdown: {
        height: 50,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    dropdownList: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
    },

    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        maxHeight: 200,
        marginTop: 5,
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    selectedCastContainer: {
        flex: 1,
    },
    voterList: {
        paddingVertical: 10,
    },
    voterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#D9D9D9',
    },
    voterText: {
        flex: 1,
        fontSize: 15,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
    },
});
