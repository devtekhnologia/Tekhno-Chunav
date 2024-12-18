import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';

const { width, height } = Dimensions.get('screen');

const TownUsers = () => {
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const { language } = useContext(LanguageContext);
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [townUsers, setTownUsers] = useState([]);

    const searchedTown = townUsers.filter(town =>
        (town.town_user_name && town.town_user_name.toString().includes(searchedValue)) ||
        (town.town_user_id && town.town_user_id.toString().includes(searchedValue))
    );

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/town_user_info/');
            const formattedTowns = response.data;
            if (Array.isArray(formattedTowns)) {
                setTownUsers(formattedTowns);
            } else {
                Alert.alert('Expected an array of townUsers');
            }
        } catch (error) {
            Alert.alert('Error', `Error fetching data: ${error}`);

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
        fetchData();
    }, []);

    const handlePDFClick = async () => {
        setPdfLoading(true);
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/generate_town_user_pdf/', {
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const fileUri = FileSystem.documentDirectory + 'town_users_report.pdf';
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            //Alert.alert('Success', 'PDF has been saved to your device!');

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to download the PDF.');
        } finally {
            setPdfLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://192.168.1.38:8000/api/delete_town_user/${userId}/`);
            const updatedUsers = townUsers.filter(user => user.town_user_id !== userId);
            setTownUsers(updatedUsers);
            Alert.alert('Success', 'User deleted successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete the user.');
        }
    };
    const confirmDelete = (userId) => {
        Alert.alert(
            "Delete User",
            "Are you sure you want to delete this user?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => handleDeleteUser(userId), style: "destructive" }
            ]
        );
    };


    return (
        <HeaderFooterLayout
            showFooter={false}
            headerText={language === 'en' ? 'Town Users' : 'गाव/शहर कार्यकर्ता'}
            rightIcon={true}
            rightIconName="file-pdf"
            onRightIconPress={handlePDFClick}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder={language === 'en' ? 'Search by voter’s name' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={searchedTown}
                        keyExtractor={item => item.town_user_id.toString()}
                        showsVerticalScrollIndicator={true}
                        renderItem={({ item, index }) => (
                            <Pressable
                                style={styles.voterItem}
                                onLongPress={() => confirmDelete(item.town_user_id)}
                            >
                                <View style={styles.voterDetails}>
                                    <View style={styles.townUserIdContainer}>
                                        <Text style={styles.townUserIdText}>{index + 1}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <Text style={{ fontWeight: '700' }}>{toTitleCase(item.town_user_name)}</Text>
                                        <Text style={styles.townUserContactText}>Ph. No: {item.town_user_contact_number}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <Text style={styles.townUserTownText}>Town: {toTitleCase(item.town_names)}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        ListHeaderComponent={loading && <LoadingListComponent />}
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />
                </View>

                {/* PDF loading overlay */}
                {pdfLoading && (
                    <View style={styles.pdfLoadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.pdfLoadingText}>Downloading PDF...</Text>
                    </View>
                )}
            </View>
        </HeaderFooterLayout>
    );
};

export default TownUsers;

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1.5,
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
    listContainer: {},
    voterItem: {
        flex: 1,
        borderRadius: 2,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.2,
    },
    voterDetails: {
        flex: 1,
        flexDirection: 'row',
        gap: 20,
    },
    townUserIdContainer: {
        borderWidth: 1,
        borderColor: 'blue',
        width: 30,
        padding: 5,
        textAlign: 'center',
        borderRadius: 3,
        alignItems: 'center',
    },
    townUserIdText: {
        fontWeight: '700',
    },
    townUserContactText: {
        color: '#565D6D',
        fontSize: 11,
    },
    townUserTownText: {
        color: '#565D6D',
        fontSize: 13,
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
    pdfLoadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfLoadingText: {
        color: 'white',
        marginTop: 10,
    },
});
