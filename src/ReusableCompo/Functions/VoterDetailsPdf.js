import { Alert } from "react-native";
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const downloadVoterPdf = async (voterId) => {
    try {
        const response = await axios.get(`http://192.168.1.38:8000/api/generate_voter_pdf/${voterId}`, {
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

        //Alert.alert('Success', 'PDF has been saved to your device!');

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            Alert.alert('Error', 'Sharing not available on this device.');
        }

    } catch (error) {
        Alert.alert('Error', 'Failed to download the PDF.');
    }
};