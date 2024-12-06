import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import WardVoterDetailsPopup from './WardVoterDetailsPopup';
import WardHeaderFooter from './WardHeaderFooter';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { WardUserContext } from '../ContextApi/WardUserContext';
import EditVoterForm from '../ReusableCompo/EditVoterForm';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';

const { height, width } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);

export default function Wardvoterlist({ route, navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { wardUserId } = useContext(WardUserContext);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [clickedVoter, setClickedVoter] = useState(null);
  const [animatedValue] = useState(new Animated.Value(1));
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);



  const handleSearch = (text) => {
    setRefreshing(true);
    setSearchText(text);
    const filtered = voters.filter(voter =>
      voter.voter_id.toString().includes(text) || voter.voter_name.toLowerCase().includes(text.toLowerCase())
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


  const fetchVoters = async () => {
    try {
      const response = await axios.get(`http://192.168.1.24:8000/api/get_voterlist_by_prabhag_user/${wardUserId}/`);
      if (response.data && Array.isArray(response.data)) {
        const votersWithIndex = response.data.map((voter, index) => ({
          ...voter,
          originalIndex: index + 1,
        }));
        setVoters(votersWithIndex);
        setFilteredVoters(votersWithIndex);
        // setVoters(response.data);
        // setFilteredVoters(response.data);
      } else {
        setError('Unexpected API response format.');
      }
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchVoters();
  }, [wardUserId]);


  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }


  const fetchVoterDetails = (voter_id) => {
    axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data); // Set selected voter details
        setFormVisible(true); // Show the modal
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      });
  };

  const renderItem = ({ item, index }) => {
    const fixedIndex = index + 1;
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
          <View style={styles.idSection}>
            <Text style={styles.itemText}>{fixedIndex}</Text>
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.itemText}>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVoters();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder={language === 'en' ? 'Search by voter’s name' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredVoters}
        keyExtractor={item => item.voter_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        extraData={filteredVoters}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
  );
}


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