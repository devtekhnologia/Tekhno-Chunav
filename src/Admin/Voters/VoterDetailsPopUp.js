import { Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import React, { useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('window');

const VoterDetailsPopUp = ({ isModalVisible, setIsModalVisible, selectedVoter }) => {
    const { language } = useContext(LanguageContext);
    // Function to handle PDF download and save
    const handlePdfIconClick = async (voterId) => {
        try {
            const response = await axios.get(`http://192.168.1.38:8000/api/generate_voter_pdf/${voterId}`, {
                params: { voter_id: voterId },
                responseType: 'arraybuffer', // Request the response as an array buffer
            });

            // Convert array buffer to base64 string
            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            // Get the file URI to save the PDF
            const fileUri = FileSystem.documentDirectory + `voter_${voterId}.pdf`;

            // Write the PDF to the file system
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            //Alert.alert('Success', 'PDF has been saved to your device!');

            // Share or open the PDF file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to download the PDF.');
        }
    };

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {selectedVoter && (
                        <>
                            <View style={styles.headerContainer}>
                                <Text style={styles.modalTitle}>{language === 'en' ? 'Voter Details' : 'मतदार माहिती'}</Text>
                                <TouchableOpacity onPress={() => handlePdfIconClick(selectedVoter.voter_id)}>
                                    <FontAwesome name="file-pdf-o" size={24} color="#db2b1f" style={styles.pdfIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Name :' : 'नाव :'}</Text>
                                <Text style={styles.value}>{language === 'en' ? selectedVoter.voter_name : selectedVoter.voter_name_mar}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Age :' : 'वर्ष :'}</Text>
                                <Text style={styles.value}>{selectedVoter.voter_age || 'N/A'}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Gender :' : 'लिंग :'}</Text>
                                <Text style={styles.value}>{selectedVoter.voter_gender || 'N/A'}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Town :' : 'गाव/शहर :'}</Text>
                                <Text style={styles.value}>{language === 'en' ? selectedVoter.town_name : selectedVoter.town_name_mar || 'N/A'}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Booth :' : 'बूथ :'}</Text>
                                <Text style={styles.value}>{language === 'en' ? selectedVoter.booth_name : selectedVoter.booth_name_mar || 'N/A'}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Contact Number:' : 'संपर्क नंबर:'}</Text>
                                <Text style={styles.value}>{selectedVoter.voter_contact_number || 'N/A'}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Cast:' : 'जात:'}</Text>
                                <Text style={styles.value}>{selectedVoter.voter_cast_name || 'N/A'}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Live Status:' : 'लाइव स्थिति:'}</Text>
                                <Text style={styles.value}>{selectedVoter.live_status_type || 'N/A'}</Text>
                            </View>

                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>{language === 'en' ? 'Close' : 'बंद करा'}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default VoterDetailsPopUp;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        // maxWidth: 400,
        // height: '70%',
        // maxHeight: 500,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    pdfIcon: {
        marginLeft: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
    },
    label: {
        flex: 0.4,
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        flex: 0.6,
        fontSize: 16,
        textAlign: 'left',
    },
    closeButton: {
        width: "90%",
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: 'black',
        borderRadius: 5,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center'
    },
});
