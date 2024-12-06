import { Alert, Dimensions, StyleSheet, Text, TextInput, View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import TempEditedVoterForm from '../../ReusableCompo/TempEditedVoterForm';
import { Checkbox } from 'react-native-paper';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('screen');

const ApprovalScreen = ({ route }) => {
  const { Buser_id } = route.params;
  const { language } = useContext(LanguageContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [casteOptions, setCasteOptions] = useState([]);
  const [isMultiSelectOn, setMultiSelectOn] = useState(false);
  const [selectedVoterIds, setSelectedVoterIds] = useState([]);
  const [isAllChecked, setAllChecked] = useState(false)
  const [message, setMessage] = useState(null)
  const statusOptions = [{ label: 'Alive', value: 1 }, { label: 'Dead', value: 2 }];
  const maritalOptions = [{ label: 'Single', value: 1 }, { label: 'Married', value: 2 }];


  useEffect(() => {
    if (selectedVoterIds.length === filteredVoters.length) {
      setAllChecked(true)
    } else {
      setAllChecked(false)
    }
  }, [selectedVoterIds])

  const fetchUpdatedVotersToApprove = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`http://192.168.1.24:8000/api/get_temp_voter_data_town/${Buser_id}/`);
      setVoters(response.data);
      setFilteredVoters(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setMessage('Voters data not available. Please try later.')
        } else {
          Alert.alert('Error', 'Failed to fetch voters. Please try later.');
        }
      } else if (error.request) {
        Alert.alert('Network Error', 'Failed to fetch voters. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try later.');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const fetchUpdatedVoterDetails = async (voter_id) => {
    setFormVisible(true);
    try {
      const response = await axios.get(`http://192.168.1.24:8000/api/get_temp_voter_data/${voter_id}`);
      setSelectedVoter(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch voter details. Please try later.');
    }
  };

  const handleVoterSelection = (voterId) => {
    setSelectedVoterIds(prevIds => prevIds.includes(voterId) ? prevIds.filter(id => id !== voterId) : [...prevIds, voterId]);
  };

  const handleOnEditVoter = (id) => {
    const filteredVoterData = voters.filter(voter => voter.temp_voter_data_voter_id !== id);

    setFilteredVoters(filteredVoterData)
    setVoters(filteredVoterData)
  }

  const approveSelectedVoters = async () => {
    try {
      const response = await axios.put(`http://192.168.1.24:8000/api/multiple_voter_data_approve/`,
        {
          "temp_voter_data_voter_ids": selectedVoterIds
        }
      )

      if (response.status === 200) {
        let filteredVoterData = filteredVoters;
        selectedVoterIds.forEach(id => {
          filteredVoterData = filteredVoterData.filter(voter => voter.temp_voter_data_voter_id !== id);
        });
        setFilteredVoters(filteredVoterData)

        let voterData = voters;
        selectedVoterIds.forEach(id => {
          voterData = voterData.filter(voter => voter.temp_voter_data_voter_id !== id);
        });

        setVoters(voterData)
      }
    } catch (error) {
      Alert.alert(error, "Failed to Approve voters.. Try again!!!");
    } finally {
      setSearchText('')
      setSelectedVoterIds([]);
      setMultiSelectOn(false);
    }
  };

  const rejectSelectedVoters = async () => {
    try {
      const response = await axios.put(`http://192.168.1.24:8000/api/reject_multiple_temp_voter_data/`,
        {
          "temp_voter_data_voter_ids": selectedVoterIds
        }
      )

      if (response.status === 200) {
        let filteredVoterData = filteredVoters;
        selectedVoterIds.forEach(id => {
          filteredVoterData = filteredVoterData.filter(voter => voter.temp_voter_data_voter_id !== id);
        });
        setFilteredVoters(filteredVoterData)

        let voterData = voters;
        selectedVoterIds.forEach(id => {
          voterData = voterData.filter(voter => voter.temp_voter_data_voter_id !== id);
        });
        setVoters(voterData)
      }
    } catch (error) {
      Alert.alert(error, "Failed to Approve voters.. Try again!!!");
    } finally {
      setSearchText('')
      setSelectedVoterIds([]);
      setMultiSelectOn(false);
    }
  };

  const fetchCasteData = async () => {
    try {
      const response = await axios.get('http://192.168.1.24:8000/api/cast/');
      const casteData = response.data.map(cast => ({
        label: `${cast.cast_id} - ${cast.cast_name}`,
        value: cast.cast_id,
      }));
      setCasteOptions(casteData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load caste data');
    }
  };


  const handleCancleAll = () => {
    setSelectedVoterIds([]);
    setAllChecked(false);
    setMultiSelectOn(false);
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setSelectedVoterIds([])
    } else {
      const allVoterIds = filteredVoters.map(voter => voter.temp_voter_data_voter_id)
      setSelectedVoterIds(allVoterIds)
    }
    setAllChecked(!isAllChecked)
  }

  const handleRejectVoter = async (id) => {
    try {
      const response = await axios.put(`http://192.168.1.24:8000/api/update_reject_status/${id}/`)
      console.log(response);

      if (response.status === 200) {
        const filteredVoterData = filteredVoters.filter(voter => voter.temp_voter_data_voter_id !== id);
        setFilteredVoters(filteredVoterData)

        const voterData = voters.filter(voter => voter.temp_voter_data_voter_id !== id);
        setVoters(voterData)
      }
    } catch (error) {
      Alert.alert(error, 'failed to reject voter ');
    } finally {
      setSearchText('')
    }
  }

  const getCastName = (castId) => casteOptions.find(option => option.value === castId)?.label || 'Unknown Cast';
  const getMaritalStatus = (statusId) => maritalOptions.find(option => option.value === statusId)?.label || 'Unknown Status';
  const getCurrentStatus = (statusId) => statusOptions.find(option => option.value === statusId)?.label || 'Unknown Status';

  useEffect(() => {
    setFilteredVoters(voters.filter(voter =>
      voter.voter_name?.toLowerCase().includes(searchText.toLowerCase())
    ));
  }, [searchText, voters]);

  useEffect(() => {
    fetchCasteData();
    fetchUpdatedVotersToApprove();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCasteData();
    fetchUpdatedVotersToApprove();
    setRefreshing(false);
  };

  const renderVoterItem = ({ item }) => {
    const isSelected = selectedVoterIds.includes(item.temp_voter_data_voter_id);
    return (
      <TouchableOpacity style={[styles.voterItem, { backgroundColor: isSelected ? '#f1f5eb' : 'white' }]}
        onPress={() => {
          if (isMultiSelectOn) {
            handleVoterSelection(item.temp_voter_data_voter_id)
          }
        }}
        onLongPress={() => {
          setMultiSelectOn(true)
          handleVoterSelection(item.temp_voter_data_voter_id)
        }}
      >
        <View>
          <Text>Voter Id: {item.temp_voter_data_voter_id}</Text>
          <Text>Name: {item.voter_name}</Text>
          {item.temp_voter_data_voter_parent_name && <Text>Parent Name: {item.temp_voter_data_voter_parent_name}</Text>}
          {item.temp_voter_data_voter_cast && <Text>Cast: {getCastName(item.temp_voter_data_voter_cast)}</Text>}
          {item.temp_voter_data_voter_live_status && <Text>Current Status: {getCurrentStatus(item.temp_voter_data_voter_live_status)}</Text>}
          {item.temp_voter_data_voter_marital_status && <Text>Marital Status: {getMaritalStatus(item.temp_voter_data_voter_marital_status)}</Text>}
          {item.temp_voter_data_voter_contact_number && <Text>Contact: {item.temp_voter_data_voter_contact_number}</Text>}
          {item.temp_voter_data_voter_gender && <Text>Gender: {item.temp_voter_data_voter_gender}</Text>}
          {item.temp_voter_data_voter_age && <Text>Age: {item.temp_voter_data_voter_age}</Text>}
        </View>
        {isMultiSelectOn ? (
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            color='green'
            onPress={() => handleVoterSelection(item.temp_voter_data_voter_id)}
          />
        ) : (
          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => handleRejectVoter(item.temp_voter_data_voter_id)}>
              <Ionicons name="close-sharp" size={28} color="red" />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => fetchUpdatedVoterDetails(item.temp_voter_data_voter_id)}>
              <Feather name="edit" size={24} color="black" />
            </TouchableOpacity> */}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder={language === 'en' ? 'Search voter here...' : 'मतदार इथे शोधा...'}
        style={styles.searchInput}
      />

      {isMultiSelectOn &&
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 }}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleCancleAll}>
            <MaterialCommunityIcons name="playlist-remove" size={30} color="black" />
          </TouchableOpacity>
          <Checkbox
            status={isAllChecked ? 'checked' : 'unchecked'}
            color='green'
            onPress={handleSelectAll}
          />
        </View>
      }

      <FlatList
        data={filteredVoters}
        renderItem={renderVoterItem}
        keyExtractor={item => item.voter_id?.toString() || Math.random().toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListHeaderComponent={refreshing && <LoadingListComponent />}
        ListEmptyComponent={!refreshing && <EmptyListComponent />}
      />


      <TempEditedVoterForm
        isVisible={isFormVisible}
        onClose={() => setFormVisible(false)}
        selectedVoter={selectedVoter}
        onEditVoter={handleOnEditVoter}
      />

      {isMultiSelectOn && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.rejectButton} onPress={rejectSelectedVoters}>
            <Ionicons name="close-sharp" size={30} color="red" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveButton} onPress={approveSelectedVoters}>
            <Ionicons name="checkmark-done-sharp" size={30} color="green" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  searchInput: {
    borderWidth: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  voterItem: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    borderWidth: 0.5,
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  rejectButton: {
    width: '40%',
    backgroundColor: '#FFABAB',
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
  },
  approveButton: {
    width: '40%',
    backgroundColor: '#D9F8C4',
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApprovalScreen;
