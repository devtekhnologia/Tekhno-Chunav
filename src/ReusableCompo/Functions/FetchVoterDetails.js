import axios from "axios";
import { Alert } from "react-native";

export const fetchVoterDetails = (voter_id) => {
    try {
        const response = axios.get(`http://192.168.1.38:8000/api/voters/${voter_id}`)
        return response;
    } catch (error) {
        // console.error('Error fetching voter details:',);
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.', error.toString ? error.toString() : 'Unknown error');
    }
};
