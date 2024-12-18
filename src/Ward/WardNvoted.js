import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import WardVoterDetailsPopup from './WardVoterDetailsPopup';
import WardHeaderFooter from './WardHeaderFooter';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { WardUserContext } from '../ContextApi/WardUserContext';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';
import LoadingModal from '../ReusableCompo/LoadingModal';
import VoterDetailsPopUp from '../ReusableCompo/VoterDetailsPopUp';


const scaleFontSize = (size) => Math.round(size * width * 0.0025);
const { height, width } = Dimensions.get('window');

export default function WardNvoted({ route, navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { wardUserId } = useContext(WardUserContext);
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
        const response = await axios.get(`http://192.168.1.38:8000/api/voter_details_by_confirmation/${wardUserId}/2/`);
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
      }
    };

    fetchVoters();
  }, [wardUserId]);

  useEffect(() => {
    const filtered = voters.filter(voter =>
      voter.voter_id.toString().includes(search) ||
      voter.voter_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVoters(filtered);
  }, [search, voters]);

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

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
    axios.get(`http://192.168.1.38:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data); // Set selected voter details
        setIsModalVisible(true); // Show the modal
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      })
      .finally(() => {
        setLoadingModalDetails(false);
      })
  };

  const renderItem = ({ item, index }) => {
    const fixedIndex = index + 1;
    let backgroundColor = 'white';

    // Set background color based on voter_favour_id
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
      <Pressable onPress={() => handleVoterPress(item)}>
        <View style={[styles.voterItem]}>
          <View style={styles.voterDetails}>
            <View style={{
              borderRightWidth: 1, borderColor: '#D9D9D9',
              width: 60, alignItems: 'center',
            }}>
              <Text>{fixedIndex}</Text>
            </View>
            <Text style={{ flex: 1 }}>{language === 'en' ? item.voter_name : item.voter_name_mar}</Text>
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
        ListEmptyComponent={!loading && <EmptyListComponent />} />



      {LoadingModalDetails ?
        <LoadingModal />
        :
        <VoterDetailsPopUp
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          selectedVoter={selectedVoter}
        />
      }
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
    backgroundColor: '#fff',
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
  },
});
