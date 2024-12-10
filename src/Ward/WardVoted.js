import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Alert } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { WardUserContext } from '../ContextApi/WardUserContext';
import WardVoterDetailsPopup from './WardVoterDetailsPopup';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';

const { height, width } = Dimensions.get('window');

export default function WardVoted({ route, navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { wardUserId } = useContext(WardUserContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);  // For pull-to-refresh

  // Function to fetch voter data
  const fetchVoters = async () => {
    try {
      const response = await axios.get(`http://192.168.1.24:8000/api/voter_details_by_confirmation/${wardUserId}/1/`);
      if (response.data && Array.isArray(response.data)) {
        setVoters(response.data);
        setFilteredVoters(response.data);
      } else {
        setError('Unexpected API response format.');
      }
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing after fetching data
    }
  };

  // UseEffect to fetch data on initial load
  useEffect(() => {
    fetchVoters();
  }, [wardUserId]);

  // Effect to filter the voters based on the Searchinput
  useEffect(() => {
    const filtered = voters.filter(voter =>
      voter.voter_id.toString().includes(search) ||
      voter.voter_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVoters(filtered);
  }, [search, voters]);

  // Function to handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);  // Set refreshing to true to trigger loading state
    fetchVoters();  // Fetch data again on refresh
  };

  // Function to fetch voter details
  const fetchVoterDetails = (voter_id) => {
    axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data); // Set selected voter details
        setIsModalVisible(true); // Show the modal
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      });
  };

  // Rendering the list item
  const renderItem = ({ item, index }) => {
    const fixedIndex = index + 1;
    let backgroundColor = 'white';

    switch (item.voter_favour_id) {
      case 1:
        backgroundColor = '#d3f5d3';
        break;
      case 2:
        backgroundColor = '#f5d3d3';
        break;
      case 3:
        backgroundColor = '#f5f2d3';
        break;
      case 4:
        backgroundColor = '#c9daff';
        break;
      case 5:
        backgroundColor = 'skyblue';
        break;
      case 6:
        backgroundColor = '#fcacec';
        break;
      case 7:
        backgroundColor = '#dcacfa';
        break;

      default:
        backgroundColor = 'white';
    }

    return (
      <Pressable style={[styles.voterItem, { backgroundColor }]}
        onPress={() => fetchVoterDetails(item.voter_id)}>
        <View style={styles.voterDetails}>
          <View style={styles.voterIdContainer}>
            <Text>{fixedIndex}</Text>
          </View>
          <Text>{item.voter_name}</Text>
        </View>
      </Pressable>
    );
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="grey" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={language === 'en' ? 'Search by voter’s name' : 'मतदाराचे नाव किंवा ओळखपत्राने शोधा'}
          style={styles.searchInput}
        />
      </View>


      <FlatList
        data={filteredVoters}
        keyExtractor={item => item.voter_id.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListHeaderComponent={loading && <LoadingListComponent />}
        ListEmptyComponent={!loading && <EmptyListComponent />}
        refreshing={refreshing}
        onRefresh={handleRefresh} // Add pull-to-refresh handler
      />

      <WardVoterDetailsPopup
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedVoter={selectedVoter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
  searchContainer: {
    borderColor: '#9095A1',
    borderWidth: 1.5,
    borderRadius: 5,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  listContent: {
    paddingBottom: 100,
  },
  voterItem: {
    borderRadius: 5,
    paddingVertical: 12,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.8,
    borderColor: '#919090',
  },
  voterDetails: {
    flexDirection: 'row',
    gap: 10,
  },
  voterIdContainer: {
    borderRightWidth: 1,
    borderColor: '#D9D9D9',
    width: 60,
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'red',
  },
});
