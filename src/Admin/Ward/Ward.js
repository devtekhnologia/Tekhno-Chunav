import {
    Dimensions, FlatList, StyleSheet, Text, TextInput,
    View, Modal, Alert, TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import React, { useState, useContext, useEffect, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { width, height } = Dimensions.get('screen');

export default function Ward() {
    const navigation = useNavigation();
    const { language } = useContext(LanguageContext);
    const [searchedValue, setSearchValue] = useState('');
    const [wards, setWards] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [booths, setBooths] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWard, setSelectedWard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [wardLoading, setWardLoading] = useState(false);


    const getWards = async () => {
        try {
            setWardLoading(true);
            const response = await axios.get('http://192.168.1.24:8000/api/get_prabhags');
            if (Array.isArray(response.data)) {
                setWards(response.data);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            Alert.alert("Error", "Could not fetch wards. Please try again later.");
        } finally {
            setWardLoading(false);
        }
    };

    useEffect(() => {
        getWards();
    }, []);

    const searchedWards = useMemo(() => {
        return wards.filter(ward => {
            const matchesSearch = ward.prabhag_name?.toLowerCase().includes(searchedValue.toLowerCase()) ||
                ward.prabhag_id?.toString().includes(searchedValue);

            const matchesFilter = selectedFilter === null ||
                (selectedFilter === 1 && ward.prabhag_type === 1) ||
                (selectedFilter === 2 && ward.prabhag_type === 2);

            return matchesSearch && matchesFilter;
        });
    }, [wards, searchedValue, selectedFilter]);

    const getBoothsByWard = async (wardId) => {
        setModalVisible(true);
        setLoading(true);
        setBooths([]); // Clear booths on new fetch
        const url = `http://192.168.1.24:8000/api/get_booth_info_by_prabhag_id/${wardId}/`;

        try {
            const response = await axios.get(url);
            setBooths(response.data);
        } catch (error) {
            handleFetchError(error.toString ? error.toString() : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchError = (error) => {
        const message = error.response
            ? `Error fetching booths: ${error.response.status} - ${error.response.statusText}`
            : "Unable to connect to the server. Please check your network connection.";
        Alert.alert("Error", message);
    };

    const handleUserPress = (prabhag_id) => {
        navigation.navigate('Ward Voters', { wardId: prabhag_id });
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setBooths([]); // Clear booths when modal closes
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            key={item.booth_id}
            style={styles.boothOption}
            onPress={() => {
                handleModalClose();
                navigation.navigate('Booth Voters', { boothId: item.booth_id });
            }}
        >
            <Text style={styles.boothId}>{language === 'en' ? 'Serial No: ' : 'सीरियल नंबर: '}{item.serial_number}</Text>
            <Text style={styles.boothName}>
                <Text style={{ fontWeight: '600', fontSize: 14 }}>{language === 'en' ? 'Booth ID: ' : 'बूथ आईडी: '}</Text> {item.booth_id}
            </Text>
            <Text style={styles.boothName}>
                <Text style={{ fontWeight: '600', fontSize: 14 }}>{language === 'en' ? 'Booth Name: ' : 'बूथ नाव: '} </Text>{language === 'en' ? item.booth_name : item.booth_name_mar}
            </Text>
            <Text style={styles.voterCount}>
                <Text style={{ fontWeight: '600', fontSize: 14 }}>{language === 'en' ? 'Voter Count:: ' : 'मतदार संख्या: '}</Text> {item.voter_count}
            </Text>
        </TouchableOpacity>
    );

    return (
        <HeaderFooterLayout
            headerText={language === 'en' ? 'Ward List' : 'प्रभाग सूची'}
            showHeader={true}
            showFooter={false}
            rightIconName="filter"
            onRightIconPress={() => setFilterVisible(!filterVisible)}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={setSearchValue}
                        placeholder={language === 'en' ? 'Search Ward by name or ID' : 'नाव किंवा आयडीनुसार प्रभाग शोधा'}
                        style={styles.searchInput}
                    />
                </View>

                {filterVisible && (
                    <View style={styles.filterDropdown}>
                        <TouchableOpacity onPress={() => {
                            setSelectedFilter(null)
                            setFilterVisible(false)
                        }}>
                            <Text style={[styles.filterOption, selectedFilter === null && styles.selectedFilterOption]}>{language === 'en' ? 'All' : 'सर्व'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSelectedFilter(1)
                            setFilterVisible(false)
                        }}>
                            <Text style={[styles.filterOption, selectedFilter === 1 && styles.selectedFilterOption]}>{language === 'en' ? 'Urban' : 'शहरी'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSelectedFilter(2)
                            setFilterVisible(false)
                        }}>
                            <Text style={[styles.filterOption, selectedFilter === 2 && styles.selectedFilterOption]}>{language === 'en' ? 'Rural' : 'ग्रामीण'}</Text>
                        </TouchableOpacity>
                    </View>
                )}


                <View style={styles.wardHeader}>
                    <Text style={styles.wardHeaderText}>{language === 'en' ? 'Ward ID' : ' आईडी'}</Text>
                    <Text style={styles.wardHeaderText}>{language === 'en' ? 'Ward Name' : 'प्रभाग नाव'}</Text>
                    <Text style={styles.wardHeaderText}>{language === 'en' ? 'Booth Count' : 'बूथ संख्या'}</Text>
                    <Text style={styles.wardHeaderText}>{language === 'en' ? 'Ward Voters' : ' प्रभाग मतदार'}</Text>
                </View>

                <FlatList
                    data={searchedWards}
                    keyExtractor={(item) => item.prabhag_id.toString()}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.wardItem} onPress={() => {
                            getBoothsByWard(item.prabhag_id);
                            setSelectedWard(item.prabhag_id);
                        }}>
                            <View style={styles.wardDetails}>
                                <Text style={styles.index}>{item.prabhag_id}</Text>
                                <Text style={styles.wardName}>{item.prabhag_name}</Text>
                            </View>
                            <View style={styles.actionContainer}>
                                <Text style={{ backgroundColor: 'white' }}>{item.booth_count}</Text>
                                <TouchableOpacity style={styles.userButton} onPress={() => handleUserPress(item.prabhag_id)}>
                                    <FontAwesome5 name="users" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListHeaderComponent={wardLoading && <LoadingListComponent />}
                    ListEmptyComponent={!wardLoading && <EmptyListComponent />}
                />

                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="blue" />
                                <Text style={styles.loadingText}>{language === 'en' ? 'Loading booths...' : 'लोड करत आहे...'}</Text>
                            </View>
                        ) : (
                            <View style={styles.modalContent}>
                                <Text style={styles.modalHeader}>
                                    {language === 'en' ? `Booths In Ward :- ${selectedWard}` : `प्रभाग ${selectedWard} मधले बूथ`}
                                </Text>
                                <FlatList
                                    data={booths}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.booth_id.toString()}
                                    ListHeaderComponent={loading && <LoadingListComponent />}
                                    ListEmptyComponent={!loading && <EmptyListComponent />}
                                />
                                <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
                                    <Text style={styles.closeText}>{language === 'en' ? 'Close' : 'बंद करा'}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Modal>
            </View >
        </HeaderFooterLayout >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        flex: 1,
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
        backgroundColor: 'white',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    filterDropdown: {
        width: 170,
        position: 'absolute',
        right: 15,
        top: 5,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 0.5,
        zIndex: 1000,
    },
    selectedFilterOption: {
        backgroundColor: '#99ccff',
        fontWeight: 'bold',
    },

    filterOption: {
        marginVertical: 5,
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
    },
    wardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 10,
    },
    wardHeaderText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    wardItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    wardDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 0.6,
    },
    actionContainer: {
        flex: 0.35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 10,
    },
    index: {
        width: 30,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '700',
        color: '#333',
    },
    wardName: {
        fontWeight: '600',
        fontSize: 16,
        color: '#333',
        flex: 1,
        paddingHorizontal: 10,
        textAlign: 'center'
    },
    userButton: {
        borderRadius: 5,
        padding: 5,
        backgroundColor: '#f0f0f0',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '75%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginBottom: 10,
        fontSize: 16,
        color: 'white',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    boothOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    boothId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    boothName: {
        color: 'black',
    },
    voterCount: {
        color: 'black',
    },
    closeButton: {
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#ffcccc',
    },
    closeText: {
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold',
    },
    emptyMessage: {
        textAlign: 'center',
        padding: 20,
        color: 'grey',
    },
});
