import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

export default function ReligionCasteList() {
  const { language } = useContext(LanguageContext);
  const [townValue, setTownValue] = useState(null);
  const [townItems, setTownItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [boothValue, setBoothValue] = useState(null);
  const [boothItems, setBoothItems] = useState([]);

  const [religionValue, setReligionValue] = useState(null);
  const [religionItems, setReligionItems] = useState([
    { label: language === 'en' ? 'Hindu' : 'हिंदू', value: 1 },
    { label: language === 'en' ? 'Muslim' : 'मुस्लिम', value: 2 },
    { label: language === 'en' ? 'Christian' : 'ख्रिश्चन', value: 3 },
  ]);

  const [casteValue, setCasteValue] = useState(null);
  const [casteItems, setCasteItems] = useState([]);

  const [voters, setVoters] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchTowns = async () => {
    try {
      const response = await axios.get('http://192.168.1.38:8000/api/towns/');
      const townsData = response.data.map(town => ({
        label: `${town.town_id} - ${language === 'en' ? town.town_name : town.town_name_mar}`,
        value: town.town_id,
      }));
      setTownItems(townsData);
    } catch (error) {
      console.error('Error fetching towns:', error);
      Alert.alert('Error', 'Failed to load towns');
    }
  };

  const fetchBoothsByTown = async (townId) => {
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/booths_by_town/${townId}`);
      const boothsData = response.data.map(booth => ({
        label: `${booth.booth_id} - ${language === 'en' ? booth.booth_name : booth.booth_name_mar}`,
        value: booth.booth_id,
      }));
      setBoothItems(boothsData);
    } catch (error) {
      console.error('Error fetching booths:', error);
      Alert.alert('Error', 'Failed to load booths');
    }
  };

  const fetchCasteData = async (religionId) => {
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/cast_by_religion/${religionId}`);
      const casteData = response.data.map(cast => ({
        label: `${cast.cast_id} - ${cast.cast_name}`,
        value: cast.cast_id,
      }));
      setCasteItems(casteData);
    } catch (error) {
      console.error('Error fetching caste data:', error);
      Alert.alert('Error', 'Failed to load caste data');
    }
  };

  const fetchVotersByBoothAndCaste = async (boothId, castId) => {
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/booth/${boothId}/cast/${castId}/`);
      setVoters(response.data);
    } catch (error) {
      console.error('Error fetching voters:', error);
      Alert.alert('Error', 'Failed to load voters');
    }
  };

  useEffect(() => {
    fetchTowns();
  }, []);

  useEffect(() => {
    if (townValue) {
      fetchBoothsByTown(townValue);
    }
  }, [townValue]);

  useEffect(() => {
    if (religionValue) {
      fetchCasteData(religionValue);
    }
  }, [religionValue]);

  useEffect(() => {
    if (boothValue && casteValue) {
      fetchVotersByBoothAndCaste(boothValue, casteValue);
    }
  }, [boothValue, casteValue]);

  const renderVoterItem = ({ item, index }) => (
    <View style={styles.voterItem}>
      <Text style={styles.voterText}>{item.voter_serial_number} - {language === 'en' ? item.voter_name : item.voter_name_mar}</Text>
      <Text style={styles.voterContact}>{language === 'en' ? 'Voter Id' : 'मतदार आयडी'}: {item.voter_id_card_number}</Text>
      <Text style={styles.voterContact}>{language === 'en' ? 'Contact' : 'संपर्क'}: {item.voter_contact_number}</Text>
    </View>
  );

  const handlePDFClick = async () => {
    if (!townValue || !boothValue || !religionValue || !casteValue) {
      Alert.alert('Error', 'Please select all fields');
      return;
    }

    setPdfLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/booth_pdf/${boothValue}/cast/${casteValue}/`, {
        responseType: 'arraybuffer',
      });

      const base64 = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const fileUri = FileSystem.documentDirectory + 'town_users_report.pdf';
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert('Success', 'PDF has been saved to your device!');

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'Sharing not available on this device.');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      Alert.alert('Error', 'Failed to download the PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const renderDropdown = () => (
    <>
      <Dropdown
        style={styles.dropdown}
        data={townItems}
        labelField="label"
        valueField="value"
        placeholder={language === 'en' ? 'Select Town' : 'गाव/शहर निवडा'}
        value={townValue}
        onChange={item => setTownValue(item.value)}
      />

      {townValue && (
        <Dropdown
          style={styles.dropdown}
          data={boothItems}
          labelField="label"
          valueField="value"
          placeholder={language === 'en' ? 'Select Booth' : 'बूथ निवडा'}
          value={boothValue}
          onChange={item => setBoothValue(item.value)}
        />
      )}

      {boothValue && (
        <Dropdown
          style={styles.dropdown}
          data={religionItems}
          labelField="label"
          valueField="value"
          placeholder={language === 'en' ? 'Select Religion' : 'धर्म निवडा'}
          value={religionValue}
          onChange={item => setReligionValue(item.value)}
        />
      )}

      {religionValue && (
        <Dropdown
          style={styles.dropdown}
          data={casteItems}
          labelField="label"
          valueField="value"
          placeholder={language === 'en' ? 'Select Caste' : 'जात निवडा'}
          value={casteValue}
          onChange={item => setCasteValue(item.value)}
        />
      )}

      <Text style={styles.filteredVotersText}>------{language === 'en' ? 'Filtered Voters' : 'फिल्टर केलेले मतदार'}------</Text>

    </>
  );

  return (
    <HeaderFooterLayout
      showFooter={false}
      headerText={language === 'en' ? 'Caste Wise Voters' : 'जातीनुसार मतदार'}
      rightIconName="file-pdf"
      onRightIconPress={handlePDFClick}
    >
      <FlatList
        data={voters}
        ListHeaderComponent={renderDropdown}
        renderItem={renderVoterItem}
        keyExtractor={(item) => item.voter_id.toString()}
        ListEmptyComponent={!loading && <EmptyListComponent />}
        contentContainerStyle={styles.container}
      />
    </HeaderFooterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropdown: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  filteredVotersText: {
    color: 'gray',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    // marginVertical: 10,
  },
  voterItem: {
    padding: 10,
    marginVertical: 7,
    // backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 0.5,
  },
  voterText: {
    fontSize: 16,
  },
  voterContact: {
    fontSize: 14,
    color: '#555',
  },
  noVotersText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});
