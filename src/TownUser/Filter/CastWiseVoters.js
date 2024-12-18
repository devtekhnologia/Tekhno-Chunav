import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View, Alert, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import { TouchableOpacity } from 'react-native';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { height } = Dimensions.get('screen');

const CastWiseVoters = () => {
    const { userId } = useContext(TownUserContext);
    const { language } = useContext(LanguageContext);
    const [selectedCast, setSelectedCast] = useState(null);
    const [items, setItems] = useState([]);
    const [voters, setVoters] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCasteData = async () => {
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/cast/');
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
            const response = await axios.get(`http://192.168.1.38:8000/api/get_voters_by_town_user_and_cast/${userId}/${selectedCast}/`);
            setVoters(response.data);
        } catch (error) {
            Alert.alert('Error fetching voters:', error.toString ? error.toString() : 'Unknown error');
        } finally {
            setLoading(false);
        }
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

    const renderVoterItem = ({ item, index }) => {
        const fixedIndex = index + 1;
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

            <Pressable
                style={[styles.voterItem, { backgroundColor }]}
                // onPress={() => handleVoterPress(item.voter_id)}
                // onLongPress={() => handleLongPress(item.voter_id)}
            >
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
            </Pressable>
        )
    }

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
        flex: 1,
        // paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'white'
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
        marginHorizontal: 20,
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
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        marginHorizontal: 20
    },
    voterDetails: {
        flexDirection: 'column',
        width: '100%',
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
        fontWeight: '900',
        color: '#333',
        textAlign: 'center',
    },
});
