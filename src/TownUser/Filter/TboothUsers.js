import { ActivityIndicator, Alert, Dimensions, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { MaterialIcons, Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import BuserDetailsPopUp from '../../ReusableCompo/BuserDetailsPopUp';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('screen');
const TboothUsers = () => {
    const navigation = useNavigation()
    const { userId } = useContext(TownUserContext);
    const { language, toggleLanguage } = useContext(LanguageContext);
    const [searchedValue, setSearchValue] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [booths, setBooths] = useState([]);
    const [selectedBuser, setBuser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [error, setError] = useState('')

    const searchedBooth = booths.filter(user => {
        const boothId = user.user_id ? user.user_id.toString().toLowerCase() : '';
        const boothName = user.user_name ? user.user_name.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();

        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });


    const fetchData = async () => {
        setRefreshing(true); // Start loading indicator
        try {
            const response = await axios.get(`http://192.168.1.38:8000/api/get_booth_users_by_town_user/${userId}/`);
            const formattedTowns = response.data;

            if (Array.isArray(formattedTowns)) {
                setBooths(formattedTowns);
            } else {
                setBooths([]);
            }
        } catch (error) {
            if (error.response.status === 404) {
                Alert.alert("Alert", "Booth users not available...")
                console.warn('Error fetching booth users');
            } else if (error.response) {
                Alert.alert('Server responded with status:', error.response.status);
                setError(`Error ${error.response.status}: ${error.response.data.message || 'Failed to fetch data.'}`);
            } else if (error.request) {
                Alert.alert('No response received:', error.request);
                setError('No response from the server. Please check your connection.');
            } else {
                Alert.alert('Error in request setup:', error.message);
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setRefreshing(false);
        }
    };


    const fetchUserDetails = (id) => {
        axios.get(`http://192.168.1.38:8000/api/booth_user_info/${id}`)
            .then(response => {
                setBuser(response.data);
                setIsModalVisible(true);
            })
            .catch(error => {
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };



    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
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


            <FlatList
                data={searchedBooth}
                keyExtractor={item => item.user_id.toString()}
                showsVerticalScrollIndicator={true}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                renderItem={({ item, index }) => (
                    <Pressable style={styles.voterItem} onLongPress={() => fetchUserDetails(item.user_id)}
                        onPress={() => {
                            navigation.navigate("Approval Voters", { Buser_id: item.user_id });
                        }}>
                        <Text style={{
                            borderWidth: 1, borderColor: 'blue', width: 30,
                            textAlign: 'center', borderRadius: 3, fontWeight: '700'
                        }}>{index + 1}</Text>
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text style={{ flex: 1 }}>{item.user_name}</Text>
                            <Text style={styles.phoneText}>Ph. No: {item.user_phone}</Text>
                        </View>
                        <Pressable onPress={() => { navigation.navigate('Approval Voters', { Buser_id: item.user_id }) }}>
                            <MaterialCommunityIcons name="arrow-right-bold-box" size={height * 0.04} color="#0077b6" />
                        </Pressable>
                    </Pressable>
                )}
                ListHeaderComponent={refreshing && <LoadingListComponent />}
                ListEmptyComponent={!refreshing && <EmptyListComponent />}
            />

            <BuserDetailsPopUp
                isModalVisible={isModalVisible}
                selectedBuser={selectedBuser}
                setIsModalVisible={setIsModalVisible}
            />

        </View>
    )
}

export default TboothUsers


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: height * 0.86,
        backgroundColor: 'white'
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
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
        columnGap: 20,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    listContainer: {
        height: height * 0.75
    },
    voterItem: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 0.1,
        gap: 10,
        alignItems: 'center'
    },

    noDataText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: 'gray',
    },
    loadingContainer: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    phoneText: {
        color: '#565D6D',
        fontSize: 11,
    },
});
