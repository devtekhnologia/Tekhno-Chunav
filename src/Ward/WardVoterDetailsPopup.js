import { Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width, height } = Dimensions.get('window');

export default function WardVoterDetailsPopup({ isModalVisible, setIsModalVisible, selectedVoter }) {

    // Function to handle PDF download and save
    const handlePdfIconClick = async (voterId) => {
        try {
            const response = await axios.get(`http://192.168.1.24:8000/api/generate_voter_pdf/${voterId}`, {
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

            Alert.alert('Success', 'PDF has been saved to your device!');

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
                                <Text style={styles.modalTitle}>Voter Details</Text>
                                <TouchableOpacity onPress={() => handlePdfIconClick(selectedVoter.voter_id)}>
                                    <FontAwesome name="file-pdf-o" size={24} color="#db2b1f" style={styles.pdfIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Name:</Text>
                                <Text style={styles.value}>{selectedVoter.voter_name}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Age:</Text>
                                <Text style={styles.value}>{selectedVoter.voter_age}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Gender:</Text>
                                <Text style={styles.value}>{selectedVoter.voter_gender}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Town:</Text>
                                <Text style={styles.value}>{selectedVoter.town_name}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Booth:</Text>
                                <Text style={styles.value}>{selectedVoter.booth_name}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Contact:</Text>
                                <Text style={styles.value}>{selectedVoter.voter_contact_number}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Caste:</Text>
                                <Text style={styles.value}>{selectedVoter.voter_cast_name}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Live Status:</Text>
                                <Text style={styles.value}>{selectedVoter.live_status_type}</Text>
                            </View>

                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};



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
        maxWidth: 400,
        height: '70%',
        maxHeight: 500,
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    pdfIcon: {
        marginLeft: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8, // Reduce margin to minimize the gap
    },
    label: {
        flex: 0.4, // Adjust flex to reduce gap
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        flex: 0.6, // Adjust flex to reduce gap
        fontSize: 16,
        textAlign: 'right',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'black',
        borderRadius: 5,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
