import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated, Easing, Modal, TextInput, Button, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import FamilyModal from './FamilyModal';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import { toTitleCase } from '../../ReusableCompo/Functions/toTitleCaseConvertor';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

export default function Familylist({ navigation }) {
  const { language } = useContext(LanguageContext);
  const { buserId } = useContext(BoothUserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [arrowAnimations, setArrowAnimations] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [voterModalVisible, setVoterModalVisible] = useState(false);
  const [voterData, setVoterData] = useState([]);
  const [selectedVoter, setSelectedVoter] = useState([]);

  const fetchFamilyGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/get_family_groups_by_user/${buserId}/`);
      if (response.status === 200) {
        const familyGroups = await Promise.all(response.data.map(async (group) => {
          const membersResponse = await axios.get(`http://192.168.1.38:8000/api/get_voters_by_group_id/${group.family_group_id}/`);
          const membersCount = membersResponse.status === 200 ? membersResponse.data.voters.length : 0;
          return { ...group, member_count: membersCount };
        }));
        setData(familyGroups);
        initializeArrowAnimations(familyGroups);
      } else {
        setError('Data not found');
      }
    } catch (error) {
      console.error('Error fetching family group data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const initializeArrowAnimations = (groups) => {
    const animations = {};
    groups.forEach((group) => {
      animations[group.family_group_id] = new Animated.Value(0);
    });
    setArrowAnimations(animations);
  };

  useEffect(() => {
    if (buserId) {
      fetchFamilyGroups();
    } else {
      setError('Invalid user ID');
    }
  }, [buserId]);

  const handlePress = async (id) => {
    setSelectedId(selectedId === id ? null : id);

    Animated.timing(arrowAnimations[id], {
      toValue: selectedId === id ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (selectedId !== id) {
      setModalLoading(true);
      setModalVisible(true);
      try {
        const response = await axios.get(`http://192.168.1.38:8000/api/get_voters_by_group_id/${id}/`);
        if (response.status === 200) {
          setMembers(response.data.voters);
        }
      } catch (error) {
        console.error('Error fetching voters:', error);
      } finally {
        setModalLoading(false);
      }
    }
  };

  const handleLongPress = async (familyGroupId) => {
    setSelectedId(familyGroupId);
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/get_voters_by_user_wise/${buserId}/`);
      if (response.status === 200) {
        setVoterData(response.data.voters);
        setVoterModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching voter data:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const refreshFamilyGroups = () => {
    fetchFamilyGroups();
  };

  const toggleVoterSelection = (voterId) => {
    setSelectedVoter((prevSelected) =>
      prevSelected.includes(voterId) ? prevSelected.filter(id => id !== voterId) : [...prevSelected, voterId]
    );
  };

  const handleAddVotersToFamily = async () => {
    if (selectedVoter.length === 0 || !selectedId) {
      console.log('No voters selected or no family group selected');
      Alert.alert(language === 'en' ? 'Please select at least one voter and a family group' : 'कृपया किमान एक मतदार आणि कुटुंब गट निवडा');
      return;
    }

    setModalLoading(true);

    try {
      const requestData = {
        voter_group_id: selectedId,
        voter_ids: selectedVoter
      };

      const response = await axios.put('http://192.168.1.38:8000/api/add_voter_in_existing_group/', requestData);

      if (response.status === 200) {
        console.log(`Voters added successfully to family group ${selectedId}`);
      } else {
        console.error('Error adding voters to family group:', response.data);
        Alert.alert(language === 'en' ? 'Failed to add voters to family group' : 'कुटुंब गटात मतदार जोडताना त्रुटी');
      }

      // Refresh data after adding voters
      fetchFamilyGroups();

      setVoterModalVisible(false);
      setSelectedVoter([]);
      setModalLoading(false);

    } catch (error) {
      console.error('Error adding voters to family group:', error);
      Alert.alert(language === 'en' ? 'An error occurred while adding voters' : 'मतदार जोडताना काहीतरी चुका झाली');
      setModalLoading(false);
    }
  };

  const filteredVoterData = voterData.filter((voter) =>
    voter.voter_id.toString().includes(searchQuery) || voter.voter_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.family_group_id)}
      onLongPress={() => { handleLongPress(item.family_group_id) }}
    >
      <View style={styles.leftSection}>
        <View style={styles.row}>
          <Text style={styles.idText}>
            {language === 'en' ? 'ID' : 'क्र.'} : {index + 1}</Text>
          <Text style={styles.memberCountText}>
            {language === 'en' ? 'Members' : 'सदस्य'} : {item.member_count}</Text>
        </View>
        <Text style={styles.nameText}>
          {language === 'en' ? 'Name' : 'नाव'} : {item.family_group_name}</Text>
        <Text style={styles.contactText}>
          {language === 'en' ? 'Contact' : 'संपर्क'} : {item.family_group_contact_no}</Text>
      </View>
      {/* <Animated.View style={{ transform: [{ rotate: rotateArrow(item.family_group_id) }] }}> */}
      <MaterialIcons name="arrow-forward-ios" size={24} color="#000" style={styles.arrowIcon} />
      {/* </Animated.View> */}
    </TouchableOpacity>
  );

  const renderVoterItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.voterItem, selectedVoter.includes(item.voter_id) && styles.selectedVoter]}
      onPress={() => toggleVoterSelection(item.voter_id)}
    >
      <Text style={styles.voterText}>{language === 'en' ? 'ID' : 'क्र.'}:  {item.voter_id}</Text>
      <Text style={styles.voterText}>{language === 'en' ? 'Name' : 'नाव'}: {language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
      {selectedVoter.includes(item.voter_id) && (
        <Ionicons name="checkmark-circle" size={20} color="green" style={styles.checkmarkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.family_group_id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={loading && <LoadingListComponent />}
          ListEmptyComponent={!loading && <EmptyListComponent />}
        />
      )}

      <FamilyModal
        visible={modalVisible}
        members={members}
        setModalVisible={setModalVisible}
        setMembers={setMembers}
        refreshFamilyGroups={refreshFamilyGroups} // Pass refresh function to FamilyModal
        language={language}
      />

      <Modal
        visible={voterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setVoterModalVisible(false);
          setSelectedVoter([]);
        }}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'en' ? 'Search by ID or Name' : 'आयडी किंवा नावाने शोधा'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <FlatList
            data={filteredVoterData}
            keyExtractor={(item) => item.voter_id.toString()}
            renderItem={renderVoterItem}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Button title={language === 'en' ? 'Add to Family' : 'कुटुंबात जोडा'} onPress={handleAddVotersToFamily} />
            <Button title={language === 'en' ? 'Close' : 'बंद करा'} onPress={() => {
              setVoterModalVisible(false)
              setSelectedVoter([])
            }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginVertical: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
  },
  contactText: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  memberCountText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
  },
  searchInput: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  voterItem: {
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedVoter: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  voterText: {
    fontSize: 16,
    flex: 1,
  },
  checkmarkIcon: {
    marginLeft: 10,
  },
});
