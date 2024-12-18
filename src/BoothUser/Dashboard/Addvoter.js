import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { BoothUserContext } from '../../ContextApi/BuserContext';

const { width } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);

export default function AddVoter({ navigation }) {
  const { language } = useContext(LanguageContext);
  const { buserId } = useContext(BoothUserContext);
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [boothDropdownOpen, setBoothDropdownOpen] = useState(false);
  const [newVotername, setNewVotername] = useState('');
  const [newVotercontact, setNewVotercontact] = useState('');

  // Fetch booths for the dropdown based on buserId
  useEffect(() => {
    const fetchUserBooths = async () => {
      try {
        const response = await axios.get(`http://192.168.1.38:8000/api/user_booth/${buserId}`);
        if (response.status === 200) {
          const boothData = response.data.map(booth => ({
            label: `${booth.user_booth_booth_id} - ${language === 'en' ? booth.booth_name : booth.booth_name_mar}`,
            value: booth.user_booth_booth_id,
          }));
          setBooths(boothData);
        } else {
          Alert.alert('Error', 'Failed to load booths. Please try again later.');
        }
      } catch (error) {
        handleApiError(error, 'Failed to load booths');
      }
    };
    fetchUserBooths();
  }, [buserId]);

  const handleApiError = (error, defaultMsg) => {
    if (error.response) {
      Alert.alert('Error', `${defaultMsg}. (Error code: ${error.response.status})`);
    } else if (error.request) {
      Alert.alert('Network Error', 'Please check your internet connection.');
    } else {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  // Handle adding a new voter
  const handleAddNewVoter = async () => {
    try {
      const response = await axios.post('http://192.168.1.38:8000/api/create_new_voter/', {
        voter_name: newVotername,
        voter_booth_id: selectedBooth,
        voter_contact_number: newVotercontact,
      });

      if (response.status === 201) {
        Alert.alert('Success', `New voter added successfully.`);
        setBoothDropdownOpen(false);
        setBooths([]);
        setNewVotercontact('');
        setNewVotername('');
      } else {
        Alert.alert('Error', 'Failed to add new voter. Please try again.');
      }
    } catch (error) {
      handleApiError(error, 'Failed to add new voter');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Booth Dropdown */}
      <DropDownPicker
        open={boothDropdownOpen}
        value={selectedBooth}
        items={booths}
        setOpen={setBoothDropdownOpen}
        setValue={setSelectedBooth}
        setItems={setBooths}
        placeholder={language === 'en' ? "Select Booth" : 'बूथ निवडा'}
        containerStyle={styles.picker}
      />

      {/* Input fields for voter details */}
      {selectedBooth && (
        <>
          <TextInput
            style={styles.input}
            placeholder={language === 'en' ? 'Enter name here' : 'येथे नाव प्रविष्ट करा'}
            placeholderTextColor="#888"
            onChangeText={setNewVotername}
            value={newVotername}
          />

          <TextInput
            style={styles.input}
            placeholder={language === 'en' ? 'Enter contact number here' : 'येथे फोन नंबर प्रविष्ट करा'}
            placeholderTextColor="#888"
            onChangeText={setNewVotercontact}
            value={newVotercontact}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleAddNewVoter}>
            <Text style={styles.submitButtonText}>{language === 'en' ? 'Add Voter' : 'वोटर जोडा'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#1a7ae8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
