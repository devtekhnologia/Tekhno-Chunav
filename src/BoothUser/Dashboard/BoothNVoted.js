import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import { toTitleCase } from '../../ReusableCompo/Functions/toTitleCaseConvertor';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';
import LoadingModal from '../../ReusableCompo/LoadingModal';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';

const { height, width } = Dimensions.get('window');

export default function BoothNVoted({ route, navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { buserId } = useContext(BoothUserContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [clickedVoter, setClickedVoter] = useState(null);
  const [animatedValue] = useState(new Animated.Value(1));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [LoadingModalDetails, setLoadingModalDetails] = useState(false);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get(`http://192.168.1.24:8000/api/voted_voters_list_By_booth_user/${buserId}/2/`);
        if (response.data.voters && Array.isArray(response.data.voters)) {
          setVoters(response.data.voters);
          setFilteredVoters(response.data);
        } else {
          setError('Unexpected API response format.');
        }
      } catch (error) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, [buserId]);

  useEffect(() => {
    const filtered = voters.filter(voter =>
      voter.voter_id.toString().includes(search) ||
      voter.voter_name.toLowerCase().includes(search.toLowerCase()) ||
      voter.voter_name_mar.toLowerCase().includes(search.toLowerCase())

    );
    setFilteredVoters(filtered);
  }, [search, voters]);

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleVoterPress = (voter) => {
    setClickedVoter(voter.voter_id);

    // Fetch voter details and show modal
    fetchVoterDetails(voter.voter_id);

    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const fetchVoterDetails = (voter_id) => {
    setLoadingModalDetails(true);
    axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data);
        setIsModalVisible(true);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      })
      .finally(() => {
        setLoadingModalDetails(false);
      })
  };

  const renderItem = ({ item, index }) => {
    const isClicked = item.voter_id === clickedVoter;

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
      <Pressable onPress={() => handleVoterPress(item)} >
        <View
          style={[
            styles.voterItem, { backgroundColor: color }]}
        >
          <View style={[styles.voterDetails]}>
            <View style={{
              borderRightWidth: 1, borderColor: '#D9D9D9',
              width: 60, alignItems: 'center',
            }}>
              <Text>{index + 1}</Text>
            </View>
            <Text>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="grey" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={language === 'en' ? 'Search by ID or Name' : 'आयडी किंवा नावाने शोधा'}
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
        ListEmptyComponent={!loading && <Text style={styles.noDataText}>No results found</Text>}
      />

      {LoadingModalDetails ?
        <LoadingModal />
        :
        <VoterDetailsPopUp
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          selectedVoter={selectedVoter}
        />
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: 'white',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
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
    paddingHorizontal: 10
  },
  listContent: {
    paddingBottom: 10,
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
    // backgroundColor: 'red',
  },
  voterDetails: {
    flexDirection: 'row',
    gap: 10,
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
    backgroundColor: 'white',
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'red',
  },
});
