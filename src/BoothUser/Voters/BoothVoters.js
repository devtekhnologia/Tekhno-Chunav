import React, { useState, useEffect, useContext, memo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Dimensions, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BoothEditVoterForm from '../../ReusableCompo/BoothEditVoterForm';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
const { width, height } = Dimensions.get('screen');

export default function BoothVoters() {
  const { buserId } = useContext(BoothUserContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [sortState, setSortState] = useState(0);
  const [initialVoters, setInitialVoters] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [thumbsUpState, setThumbsUpState] = useState({});
  const [isSelectionMode, setSelectionMode] = useState(false);
  const [selectedVoters, setSelectedVoters] = useState([]);
  const { language, toggleLanguage } = useContext(LanguageContext);

  // Fetch voter details
  const fetchVoterDetails = (voter_id) => {
    axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data);
      })
      .catch(error => {
        console.error('Error fetching voter details:', error.toString ? error.toString() : 'Unknown error');
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      });
  };

  const handleSearch = (text) => {
    setSearchText(text);

    const searchTerms = text.toLowerCase().trim().split(/\s+/);

    const filtered = voters.filter((voter, index) => {
      const fixedIndex = (index + 1).toString();
        const searchFields = [
            voter.voter_id.toString(),
            voter.voter_name ? voter.voter_name.toLowerCase() : '',
            voter.voter_name_mar ? voter.voter_name_mar.toLowerCase() : ''
        ];

        return searchTerms.every(term =>
            searchFields.some(field => field.includes(term))
        );
    });

    setFilteredVoters(filtered);
};

  const handleVoterEditForm = (voter_id) => {
    fetchVoterDetails(voter_id);
    setFormVisible(true);
  };

  const handleCloseEditForm = () => {
    setFormVisible(false);
    setSelectedVoter(null);
    fetchVotersData();
  };

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSelectedVoterDetails = (newDetails) => {
    const updatedFilteredVoters = filteredVoters.map(voter => {
      if (voter.voter_id.toString() === newDetails.voter_id.toString()) {
        return { ...voter, ...newDetails };
      }
      return voter;
    });

    setFilteredVoters(updatedFilteredVoters);
  };


  const updateVoterThumbStatus = async (voterId, thumbStatus) => {
    try {
      const apiUrl = `http://192.168.1.24:8000/api/voter_confirmation/${voterId}/`;
      
      // Send the updated thumb status to the backend
      const response = await axios.put(apiUrl, {
        voter_id: voterId,
        voter_vote_confirmation_id: thumbStatus, // This will be 1 or null
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to update thumb status');
      }
  
      console.log('Thumb status updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating thumb status:', error.message);
      Alert.alert('Error', 'Failed to update thumb status. Please try again.');
      return false;
    }
  };
  
  

  const toggleThumb = async (voterId) => {
    // Update local state immediately before making the API call
    setVoters((prevVoters) =>
      prevVoters.map((item) =>
        item.voter_id === voterId
          ? { ...item, voted: item.voted === 1 ? null : 1 }
          : item
      )
    );
  
    setFilteredVoters((prevFiltered) =>
      prevFiltered.map((item) =>
        item.voter_id === voterId
          ? { ...item, voted: item.voted === 1 ? null : 1 }
          : item
      )
    );
  
    setThumbsUpState((prevState) => ({
      ...prevState,
      [voterId]: prevState[voterId] !== true,
    }));
  
    try {
      const newThumbStatus = thumbsUpState[voterId] ? null : 1;
        const updateResponse = await updateVoterThumbStatus(voterId, newThumbStatus);
  
      if (!updateResponse) {
        setVoters((prevVoters) =>
          prevVoters.map((item) =>
            item.voter_id === voterId
              ? { ...item, voted: item.voted === 1 ? 1 : null }
              : item
          )
        );
  
        setFilteredVoters((prevFiltered) =>
          prevFiltered.map((item) =>
            item.voter_id === voterId
              ? { ...item, voted: item.voted === 1 ? 1 : null }
              : item
          )
        );
  
        setThumbsUpState((prevState) => ({
          ...prevState,
          [voterId]: prevState[voterId] === true,
        }));
  
        Alert.alert('Error', 'Failed to update thumb status. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling thumb status:', error.message);
      Alert.alert('Error', 'Failed to toggle thumb status. Please try again.');
    }
  };
  
  

  const fetchVotersData = () => {
    setLoading(true);
    axios.get(`http://192.168.1.24:8000/api/get_voters_by_user_wise/${buserId}/`)
      .then(response => {
        const votersData = response.data.voters;
        setVoters(votersData);
        setFilteredVoters(votersData);
        setInitialVoters(votersData);

        const thumbsState = {};
        votersData.forEach(voter => {
          thumbsState[voter.voter_id] = voter.voter_vote_confirmation_id === 1;
        });
        setThumbsUpState(thumbsState);

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching voters data:', error.toString ? error.toString() : 'Unknown error');
        setLoading(false);
      });
  };


  const handleRefresh = () => {
    setRefreshing(true);
    fetchVotersData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchVotersData();
  }, []);


  const handleLongPress = (voterId) => {
    setSelectionMode(true);
    toggleSelectVoter(voterId);
  };

  const toggleSelectVoter = (voterId) => {
    setSelectedVoters(prevSelected => {
      if (prevSelected.includes(voterId)) {
        return prevSelected.filter(id => id !== voterId);
      } else {
        return [...prevSelected, voterId];
      }
    });
  };

  const assignColorToSelectedVoters = async (colorId) => {
    try {
        const payload = {
            voter_ids: selectedVoters,
            voter_favour_id: colorId,
        };
        
        const response = await axios.put('http://192.168.1.24:8000/api/favour/', payload);
        if (response.status === 200) {
            const updatedVoters = filteredVoters.map(voter =>
                selectedVoters.includes(voter.voter_id)
                    ? { ...voter, voter_favour_id: colorId }
                    : voter
            );
            setFilteredVoters(updatedVoters);
            exitSelectionMode();
            Alert.alert('Success', 'Color assigned successfully!');
        } else {
            throw new Error('Failed to update colors. Please try again.');
        }
    } catch (error) {
        console.error('Error assigning color:', error.message);
        Alert.alert('Error', 'Failed to assign color. Please try again.');
    }
};

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedVoters([]);
  };

  const renderItem = ({ item, index}) => {
    const fixedIndex = index + 1;
    const isSelected = selectedVoters.includes(item.voter_id);
    const isThumbsUp = thumbsUpState[item.voter_id];
    let color = 'transparent';

    if (item.voter_favour_id === 1) {
      color = '#d3f5d3';
    } else if (item.voter_favour_id === 2) {
      color = '#fededd';
    } else if (item.voter_favour_id === 3) {
      color = '#f8ff96';
    } else if (item.voter_favour_id === 4) {
      color = '#6c96f0';
    } else if (item.voter_favour_id === 5) {
      color = '#c5d7fc';
    } else if (item.voter_favour_id === 6) {
      color = '#fcaef2';
    } else if (item.voter_favour_id === 7) {
      color = '#c86dfc';
    }

    return (
      <TouchableOpacity
  onLongPress={() => handleLongPress(item.voter_id)}
  onPress={() => isSelectionMode ? toggleSelectVoter(item.voter_id) : handleVoterEditForm(item.voter_id)}
  style={[
    styles.itemContainer,
    { backgroundColor: isSelected ? '#ddd' : 'white' } 
  ]}
>
         <View style={styles.idSectionContainer}>
    <View style={[styles.idSection, { backgroundColor: color }]}>
    <Text style={styles.indexText}>{fixedIndex}</Text>
    </View>
  </View>
  <View style={styles.nameSection}>
    <Text style={styles.itemText}>{language === 'en' ? 'Name' : 'नाव'} : {toTitleCase(item.voter_name_mar)}</Text>
    <Text style={styles.itemText}>{language === 'en' ? 'Name' : 'नाव'} : {toTitleCase(item.voter_name)}</Text>
    <Text style={styles.itemTown}>{language === 'en' ? 'Contact' : 'संपर्क'} : {item.voter_contact_number}</Text>
    <Text style={styles.itemBooth}>{language === 'en' ? 'Booth' : 'बूथ'} : {item.booth_name}</Text>
  </View>
  {!isSelectionMode && (
    <TouchableOpacity onPress={() => toggleThumb(item.voter_id)} style={styles.thumbsUpIcon}>
      <Icon name={isThumbsUp ? 'thumb-up' : 'thumb-up-off-alt'} size={30} color={thumbsUpState[item.voter_id] ? 'black' : 'grey'} />
    </TouchableOpacity>
  )}
</TouchableOpacity>
    );
  };




  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder={language === 'en' ? "Search by name or ID" : 'नाव किंवा आयडी द्वारे शोधा'}
        value={searchText}
        onChangeText={handleSearch}
      />


{isSelectionMode && (
        <View style={styles.colorBar}>
          <TouchableOpacity onPress={() => assignColorToSelectedVoters(0)} style={[styles.colorButton, { backgroundColor: '#454345' }]} ><Text style={styles.colorText}></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => assignColorToSelectedVoters(1)} style={[styles.colorButton, { backgroundColor: '#90f5aa' }]} ><Text style={styles.colorText}></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => assignColorToSelectedVoters(2)} style={[styles.colorButton, { backgroundColor: '#f78f86' }]} ><Text style={styles.colorText}></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => assignColorToSelectedVoters(3)} style={[styles.colorButton, { backgroundColor: '#fce260' }]} ><Text style={styles.colorText}></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => assignColorToSelectedVoters(4)} style={[styles.colorButton, { backgroundColor: '#5e6cff' }]} ><Text style={styles.colorText}></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => assignColorToSelectedVoters(5)} style={[styles.colorButton, { backgroundColor: '#4ac9f7' }]} ><Text style={styles.colorText}></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => assignColorToSelectedVoters(6)} style={[styles.colorButton, { backgroundColor: '#f73ecc' }]} ><Text style={styles.colorText}></Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => assignColorToSelectedVoters(7)} style={[styles.colorButton, { backgroundColor: '#c32ee8' }]} ><Text style={styles.colorText}></Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.colorButton, {backgroundColor:'#d8d4d9'}]} onPress={() => exitSelectionMode()}>
          <Text style={styles.exitText}>✖</Text>
          </TouchableOpacity>
        </View>
      )}

{loading ? (
        <LoadingListComponent />
      ) : (
      <FlatList
        data={filteredVoters}
        keyExtractor={item => item.voter_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3C4CAC']}
          />
        }
        ListHeaderComponent={loading && <LoadingListComponent />}
        ListEmptyComponent={!loading && <EmptyListComponent />}
      />
      )}

      {isFormVisible && (
        <BoothEditVoterForm
          isVisible={isFormVisible}
          onClose={handleCloseEditForm}
          selectedVoter={selectedVoter}
          onEditVoter={handleSelectedVoterDetails}
        />
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    width: '100%',
    height: 45,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  itemContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    // borderColor: 'black',
  },
  idSection: {
    // width: '20%',
    // borderRightWidth: 1,
    // borderRightColor: '#ccc',
    // paddingRight: 10,
    // alignItems: 'center',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,

  },
  nameSection: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  itemTown: {
    fontSize: 14,
    color: 'black',
  },
  itemBooth: {
    fontSize: 14,
    color: 'black',
  },
  thumbsUpIcon: {
    width: 30,
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 100,
  },
  colorBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    padding: 10,
    // backgroundColor: '#eee',
},
colorButton: {
    padding: 10,
    borderRadius: 10,
},
colorText: {
    fontSize: 16,
    paddingHorizontal: 5,
    borderRadius: 5,
},
});
