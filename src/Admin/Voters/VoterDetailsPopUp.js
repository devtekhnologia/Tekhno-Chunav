import { Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert, Share, Button, Image, Linking } from 'react-native';
import React, { useContext, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import { LanguageContext } from '../../LanguageContext';
import { ActivityIndicator } from 'react-native-paper';
import { toTitleCase } from '../ReusableCompo/ToTitleCase';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function VoterDetailsPopUp({ isModalVisible, setIsModalVisible, selectedVoter }) {
    const { language } = useContext(LanguageContext);
    const [imageUrl, setImageUrl] = useState(null);

    // console.log("selectedVoter :: ", selectedVoter);

    // Function to share PDF (Already existing)
    const handlePdfIconClick = async (voterId) => {
        try {
            const response = await axios.get(`http://4.172.246.116:8000/api/generate_voter_pdf/${voterId}`, {
                params: { voter_id: voterId },
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const fileUri = FileSystem.documentDirectory + `voter_${voterId}.pdf`;

            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to download the PDF.');
        }
    };

    const shareImage = async () => {
        try {
            // Load the image from the assets folder
            const imageAsset = Asset.fromModule(require('../../../assets/bjp.png'));
            await imageAsset.downloadAsync();

            const imageUri = `${FileSystem.cacheDirectory}bjp.png`;

            await FileSystem.copyAsync({
                from: imageAsset.localUri || imageAsset.uri,
                to: imageUri,
            });
            // Set the image URL for preview
            setImageUrl(imageUri);

            if (!imageUri) {
                Alert.alert('Error', 'Failed to load image for sharing.');
                return;
            }

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(imageUri, {
                    dialogTitle: 'Share Voter Information',
                    UTI: 'public.image',
                    mimeType: 'image/png',
                });
                Alert.alert('Success', 'Image shared successfully!');
            } else {
                Alert.alert('Error', 'Sharing is not available on this device.');
            }
        } catch (error) {
            console.error('Image Sharing Error:', error);
            Alert.alert('Error', 'Failed to share the image.');
        }
    };

    const shareText = async () => {
        try {
            const message =
                `Name: ${selectedVoter.voter_name}
Polling Booth: ${selectedVoter.booth_name_mar || selectedVoter.booth_name || 'N/A'}
Town: ${selectedVoter.town_name_mar || selectedVoter.town_name || 'N/A'}
----------------------------------------
मतदान : २०२५ रोजी. स. ७ ते सायं. ६

अनु क्र. - 1
उमेदवार - अबक
पक्ष - भाजपा
चिन्ह - कमळ 🪷 

Powered By: - TEKHNO CHUNAV
Contact Us: - 7666710289`;


            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
            const supported = await Linking.canOpenURL(whatsappUrl);

            if (supported) {
                await Linking.openURL(whatsappUrl);
                Alert.alert('Success', 'Text shared on WhatsApp!');
            } else {
                Alert.alert('Error', 'WhatsApp is not installed on this device.');
            }
        } catch (error) {
            console.error('Text Sharing Error:', error);
            Alert.alert('Error', 'Failed to share the text.');
        }
    };




    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
        >
            <StatusBar style="light" translucent={true} backgroundColor="rgba(0, 0, 0, 0.69)" />
            <View style={styles.modalOverlay}>
                {selectedVoter ? (
                    <View style={styles.modalContent}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.modalTitle}>
                                {language === 'en' ? `Voter Details` : `मतदार माहिती`}
                            </Text>
                        </View>
                        <View style={styles.topSection}>
                            <Text>
                                Sr. No: <Text style={styles.label}>{selectedVoter.voter_serial_number}</Text>
                            </Text>
                            <Text>
                                Voter Id: <Text style={styles.label}>{selectedVoter.voter_id_card_number}</Text>
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.bottomSection}>
                            <Text style={styles.voterName}>
                                {language === 'en' ? (
                                    <>
                                        Name : <Text style={{ fontWeight: '500', fontSize: 16 }}> {toTitleCase(selectedVoter.voter_name)} </Text>
                                    </>
                                ) : (
                                    <>
                                        नाव : <Text style={{ fontWeight: '500', fontSize: 16 }}> {selectedVoter.voter_name_mar} </Text>
                                    </>
                                )}
                            </Text>


                            <Text style={styles.voterName}>
                                {language === 'en' ? (
                                    <>
                                        Voter Booth: <Text style={{ fontWeight: '500', fontSize: 16 }}> {toTitleCase(selectedVoter.booth_name)}</Text>
                                    </>
                                ) : (
                                    <>
                                        मतदार बूथ: <Text style={{ fontWeight: '500', fontSize: 16 }}>{selectedVoter.booth_name_mar} </Text>
                                    </>
                                )}
                            </Text>
                        </View>

                        <View style={{ padding: 20 }}>
                            {imageUrl && (
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>{language === 'en' ? 'Image Preview ' : 'चित्र पूर्वावलोकन'} :</Text>
                                    <Image source={{ uri: imageUrl }} style={{ width: "100%", height: 200, marginVertical: 10 }} />
                                </View>
                            )}
                        </View>

                        <View style={styles.shareButtonContainer}>
                            <TouchableOpacity onPress={shareImage} style={[styles.shareButton, styles.leftButton]}>
                                <Text style={styles.shareButtonText}>{language === 'en' ? 'Share Image' : 'चित्र शेअर करा'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={shareText} style={[styles.shareButton, styles.rightButton]}>
                                <Text style={styles.shareButtonText}>{language === 'en' ? 'Share Info' : 'माहिती शेअर करा'}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>{language === 'en' ? 'Close' : 'बंद करा'}</Text>
                        </TouchableOpacity>

                    </View>
                ) :
                    (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size={'large'} color='white' />
                            <Text style={{ color: 'white', fontSize: 18, marginVertical: 10 }}>{language === 'en' ? 'Loading voters...' : 'लोडिंग मतदार...'}</Text>
                        </View>
                    )
                }
            </View >
        </Modal >
    )
};



const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.69)',
    },
    modalContent: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    voterDetails: {
        flexDirection: 'column',
        flex: 1,
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
        // alignItems: 'center',
        justifyContent: 'center',
    },
    voterName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        // textAlign: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
    },
    shareButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    shareButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: 'black',
        borderRadius: 5,
        justifyContent: 'center'
    },
    leftButton: {
        marginRight: 10, // Adds space between the buttons
    },
    rightButton: {
        marginLeft: 10, // Adds space between the buttons
    },
    shareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    closeButton: {
        width: "100%",
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: 'black',
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 5
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});