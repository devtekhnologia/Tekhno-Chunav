import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native'
import axios from 'axios'
import { Alert } from 'react-native'
import EditVoterForm from '../../ReusableCompo/EditVoterForm'
import { TownUserContext } from '../../ContextApi/TownUserProvider'
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent'
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent'
import { LanguageContext } from '../../ContextApi/LanguageContext'


const { height, width } = Dimensions.get('screen');
const TownVoters = () => {
  const { userId } = useContext(TownUserContext);
  const { language } = useContext(LanguageContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchVoterDetails = (voter_id) => {
    axios.get(`http://192.168.1.38:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data);
      })
      .catch(error => {
        Alert.alert('Error fetching voter details:', error.toString ? error.toString() : 'Unknown error');
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      });
  };


  const handleSearch = (text) => {
    setRefreshing(true);
    setSearchText(text);
    const filtered = voters.filter(voter =>
      voter.voter_id.toString().includes(text)
      || voter.voter_name.toLowerCase().includes(text.toLowerCase())
      || voter.voter_name_mar.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVoters(filtered);
    setRefreshing(false);
  };



  const handleVoterEditForm = (voter_id) => {
    fetchVoterDetails(voter_id);
    setFormVisible(true);
  };


  const handleCloseEditForm = () => {
    setFormVisible(false)
    setSelectedVoter(null)
  }

  const handleSelectedVoterDetails = (newDetails) => {
    const updatedFilteredVoters = filteredVoters.map(voter => {
      if (voter.voter_id.toString() === newDetails.voter_id.toString()) {
        return { ...voter, ...newDetails };
      }
      return voter;
    });

    setFilteredVoters(updatedFilteredVoters);
  }


  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const fetchUpdatedVoters = async () => {
    setLoading(true);
    axios.get(`http://192.168.1.38:8000/api/get_voter_list_by_town_user/${userId}/`)
      .then(response => {
        const votersData = response.data;
        setVoters(votersData);
        setFilteredVoters(votersData);
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error fetching voters data:', error.toString ? error.toString() : 'Unknown error');
        setLoading(false);
      });
  }


  useEffect(() => {
    fetchUpdatedVoters()
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUpdatedVoters();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => {
    let backgroundColor = 'white';

    if (item.voter_favour_id === 1) {
      backgroundColor = '#d3f5d3';
    } else if (item.voter_favour_id === 2) {
      backgroundColor = '#f5d3d3';
    } else if (item.voter_favour_id === 3) {
      backgroundColor = '#f5f2d3';
    } else if (item.voter_favour_id === 4) {
      backgroundColor = '#c9daff';
    } else if (item.voter_favour_id === 5) {
      backgroundColor = 'skyblue';
    } else if (item.voter_favour_id === 6) {
      backgroundColor = '#fcacec';
    } else if (item.voter_favour_id === 7) {
      backgroundColor = '#dcacfa';
    }

    return (
      <View style={[styles.itemContainer, { backgroundColor }]}>
        <TouchableOpacity style={styles.voterRecord} onPress={() => { handleVoterEditForm(item.voter_id) }}>
          <View style={styles.voterDetails}>
                              <View style={styles.topSection}>
                                  <Text>
                                      Sr. No: <Text style={styles.label}>{item.voter_serial_number}</Text>
                                  </Text>
                                  <Text>
                                      Voter Id: <Text style={styles.label}>{item.voter_id_card_number}</Text>
                                  </Text>
                              </View>
                              <View style={styles.divider} />
                              <View style={styles.bottomSection}>
                                  <Text style={styles.voterName}>
                                      {language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}
                                  </Text>
                              </View>
                          </View>
        </TouchableOpacity>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder={language === 'en' ? 'Search by voter’s name or ID' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredVoters}
        keyExtractor={item => item.voter_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        extraData={filteredVoters}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListHeaderComponent={loading && <LoadingListComponent />}
        ListEmptyComponent={!loading && <EmptyListComponent />}
      />

      <EditVoterForm
        isVisible={isFormVisible}
        onClose={handleCloseEditForm}
        selectedVoter={selectedVoter}
        onEditVoter={handleSelectedVoterDetails}
      />

    </View >
  )
}

export default TownVoters

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  searchBar: {
    width: "100%",
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  voterCountContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updatedVotersText: {
    color: '#43eb34',
    fontSize: height * 0.025,
    fontWeight: 'bold',
  },
  remainingVotersText: {
    color: '#f2fc28',
    fontSize: height * 0.025,
    fontWeight: 'bold',
    marginTop: 5,
  },
  itemContainer: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  voterRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    alignItems: 'center',
    justifyContent: 'center',
},
voterName: {
    fontSize: 18,
    fontWeight:'900',
    color: '#333',
    textAlign: 'center',
},
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});