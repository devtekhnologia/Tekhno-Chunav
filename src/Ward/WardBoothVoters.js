import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import WardHeaderFooter from './WardHeaderFooter';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';
import { LanguageContext } from '../ContextApi/LanguageContext';
import LoadingModal from '../ReusableCompo/LoadingModal';
import VoterDetailsPopUp from '../ReusableCompo/VoterDetailsPopUp';
import { TouchableOpacity } from 'react-native';
import EditVoterForm from '../ReusableCompo/EditVoterForm';


const scaleFontSize = (size) => Math.round(size * width * 0.0025);
const { height, width } = Dimensions.get('window');

export default function WardBoothVoters({ route, navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [clickedVoter, setClickedVoter] = useState(null);
  const [animatedValue] = useState(new Animated.Value(1));
  const { boothId } = route.params;
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [LoadingModalDetails, setLoadingModalDetails] = useState(false);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get(`http://192.168.1.24:8000/api/get_voters_by_booth/${boothId}`);
        if (response.data && response.data && Array.isArray(response.data)) {

          const voterData = response.data.map(voter => ({
            voter_id: voter.voter_id,
            voter_name: voter.voter_name,
            voter_name_mar: voter.voter_name_mar
          }));
          setVoters(voterData);
          setFilteredVoters(voterData);
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
  }, [route.params.boothId]);

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

  const fetchVoterDetails = (voter_id) => {
    setLoadingModalDetails(true);
    axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data);
        setFormVisible(true);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      })
      .finally(() => {
        setLoadingModalDetails(false);
      })
  };

  const handleCloseEditForm = () => {
    setFormVisible(false);
    setSelectedVoter(null);
  };


  const handleSelectedVoterDetails = (newDetails) => {
    const updatedFilteredVoters = filteredVoters.map(voter =>
      voter.voter_id.toString() === newDetails.voter_id.toString() ? { ...voter, ...newDetails } : voter
    );
    setFilteredVoters(updatedFilteredVoters);
  };

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
      <TouchableOpacity style={[styles.voterItem, { backgroundColor }]}
        onPress={() => fetchVoterDetails(item.voter_id)}>
        <View style={styles.idSection}>
        <Text>{fixedIndex}</Text>
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.itemText}>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const toTitleCase = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="grey" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={language === 'en' ? "search booth by name or ID" : 'नाव किंवा आयडीद्वारे बूथ शोधा'}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredVoters}
        keyExtractor={item => item.voter_id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListHeaderComponent={loading && <LoadingListComponent />}
        ListEmptyComponent={!loading && <EmptyListComponent />}
      />

      {LoadingModalDetails ?
        <LoadingModal />
        :
        <EditVoterForm
          isVisible={isFormVisible}
          onClose={handleCloseEditForm}
          selectedVoter={selectedVoter}
          onEditVoter={handleSelectedVoterDetails}
        />
      }
    </View>
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
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'red',
  },
  idSection: {
    width: '20%',
    borderRightWidth: 1,
    borderRightColor: 'black',
    paddingRight: 10,
    alignItems: 'center',
  },
  nameSection: {
    width: '80%',
    paddingLeft: 10,
  },
  itemText: {
    fontSize: height * 0.018,
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

});
