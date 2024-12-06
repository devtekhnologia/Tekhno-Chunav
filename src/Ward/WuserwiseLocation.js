import { Dimensions, StyleSheet, Text, View, TextInput, FlatList, Alert } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import WardHeaderFooter from './WardHeaderFooter';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WardUserContext } from '../ContextApi/WardUserContext';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';
import { LanguageContext } from '../ContextApi/LanguageContext';

const scaleFontSize = (size) => Math.round(size * width * 0.0025);
const { height, width } = Dimensions.get('window');


export default function WuserwiseLocation({ navigation }) {
    const { wardUserId } = useContext(WardUserContext);
    const { language } = useContext(LanguageContext);
    const [locationValue, setLocationValue] = useState(null);
    // const [locationItems] = useState([
    //     { label: 'In City', value: 1 },
    //     { label: 'Near City', value: 2 },
    //     { label: 'Out of City', value: 3 }
    // ]);

    const [locationItems] = useState([
        { label: language === 'en' ? 'In City' : 'शहरामध्ये', value: 1 },
        { label: language === 'en' ? 'Near City' : 'शहराजवळ', value: 2 },
        { label: language === 'en' ? 'Out of City' : 'शहराबाहेर', value: 3 }
    ]);
    const [voterData, setVoterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);

    const fetchVoterData = async () => {
        if (locationValue) {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://192.168.1.24:8000/api/get_voter_current_location_details_by_prabhag_user/prabhag_user_id/${wardUserId}/city_id/${locationValue}/`
                );
                setVoterData(response.data);
            } catch (error) {
                Alert.alert('Error fetching voter data:', error.toString ? error.toString() : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
    };

    // Call fetchVoterData whenever locationValue changes
    useEffect(() => {
        if (locationValue) {
            fetchVoterData();
        }
    }, [locationValue]);

    const handlePDFClick = async () => {
        if (!locationValue) {
            Alert.alert('Error', 'Please select a Location');
            return;
        }

        setPdfLoading(true);
        try {
            const response = await axios.get(
                `http://192.168.1.24:8000/api/generate_voter_pdf_by_prabhag_user/prabhag_user_id/${wardUserId}/city_id/${locationValue}/`,
                { responseType: 'arraybuffer' }
            );
            const base64 = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            const fileUri = FileSystem.documentDirectory + 'voters_report.pdf';
            await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
            Alert.alert('Success', 'PDF has been saved to your device!');

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

    const renderVoterItem = ({ item }) => (
        <View style={styles.voterItem}>
            <Text style={styles.voterText}>{language === 'en' ? 'ID' : 'आईडी'} {item.voter_id}</Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Name' : 'नाव'} {item.voter_name}</Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Contact' : 'संपर्क'}
                {item.voter_contact_number ? item.voter_contact_number : 'N/A'}
            </Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Location' : 'स्थान'}
                {item.voter_current_location ? item.voter_current_location : 'N/A'}
            </Text>
        </View>
    );

    const filteredVoterData = voterData.filter((voter) =>
        voter.voter_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <WardHeaderFooter
            showFooter={false}
            headerText={language === 'en' ? 'Location Wise Voter Data' : 'स्थानानुसार मतदार'}
            leftIcon={<MaterialIcons name="keyboard-backspace" size={scaleFontSize(28)} color="black" />}
            leftIconAction={handleGoBack}
            rightIcon={<FontAwesome5 name="file-pdf" size={scaleFontSize(28)} color="black" />}
            rightIconAction={handlePDFClick}
        >
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Dropdown
                        style={styles.dropdown}
                        containerStyle={styles.dropdownContainer}
                        data={locationItems}
                        labelField="label"
                        valueField="value"
                        placeholder={language === 'en' ? 'Select Location' : 'स्थान निवडा'}
                        value={locationValue}
                        onChange={(item) => setLocationValue(item.value)}
                    />
                    <TextInput
                        style={styles.searchBar}
                        placeholder={language === 'en' ? 'search by voter’s name or ID' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                    <FlatList
                        data={filteredVoterData}
                        keyExtractor={(item) => item.voter_id.toString()}
                        renderItem={renderVoterItem}
                        ListHeaderComponent={loading || pdfLoading ? <LoadingListComponent /> : null} // Fixed here
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />

                </View>

            </View>
        </WardHeaderFooter>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginHorizontal: 15,
        // marginBottom: height * 0.1,
    },
    contentContainer: {
        flex: 1,
    },
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    dropdownContainer: {
        width: '80%',
        borderColor: '#9095A1',
        borderRadius: 8,
    },
    searchBar: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
        marginVertical: 10,
        borderColor: 'black',
    },
    voterItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#9095A1',
    },
    voterText: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#9095A1',
    },
});
