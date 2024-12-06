import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert, Modal } from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { KaryakartaContext } from '../ContextApi/KaryakartaContext';
import { LanguageContext } from '../ContextApi/LanguageContext';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';
import EditVoterForm from '../ReusableCompo/EditVoterForm';

const { height, width } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);

// Function to determine background color based on voter_favour_id
const getColorByFavourId = (voter_favour_id) => {
  switch (voter_favour_id) {
    case 1:
      return '#c2ffd5';
    case 2:
      return '#fccbc7';
    case 3:
      return '#fffdc2';
    case 4:
      return '#bdc4ff';
    case 5:
      return 'skyblue';
    case 6:
      return '#ffb5ff';
    case 7:
      return '#cf90fc';
    default:
      return '#fff';
  }
};

export default function TotalVoters({ route, navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { KuserId } = useContext(KaryakartaContext);

  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [clickedVoter, setClickedVoter] = useState(null);
  const [thumbsUpStatus, setThumbsUpStatus] = useState({}); // State for thumbs-up status

  const [animatedValue] = useState(new Animated.Value(1));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [selectedVoterId, setSelectedVoterId] = useState(null);
  const [isKAddVisible, setIsKAddVisible] = useState(false);  // Modal visibility state


  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get(`http://192.168.1.24:8000/api/voters_by_group_user/${KuserId}/`);
        if (response.data && response.data.voters && Array.isArray(response.data.voters)) {
          const votersWithIndex = response.data.voters.map((voter, index) => ({
            ...voter,
            originalIndex: index + 1,
          }));
          setVoters(votersWithIndex);
          setFilteredVoters(votersWithIndex);
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
  }, [KuserId]);

  useEffect(() => {
    const filtered = voters.filter(voter =>
      voter.originalIndex.toString().includes(search) ||
      voter.voter_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVoters(filtered);
  }, [search, voters]);


  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
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



  const handleCloseEditForm = () => {
    setIsModalVisible(false)
    setSelectedVoter(null)
  }

  const handleVoterPress = (voter) => {
    setClickedVoter(voter.voter_id);
    setSelectedVoterId(voter.voter_id);
    fetchVoterDetails(voter.voter_id);
    setIsKAddVisible(true);

    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const fetchVoterDetails = (voter_id) => {
    axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data);
        setIsModalVisible(true);
      })
      .catch(error => {
        console.error('Error fetching voter details:', error);
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      });
  };

  // Update voter thumb status in the backend
  const updateVoterThumbStatus = async (voterId, thumbStatus) => {
    try {
      const apiUrl = `http://192.168.1.24:8000/api/voter_confirmation/${voterId}/`;

      const response = await axios.put(apiUrl, {
        voter_id: voterId,
        voter_vote_confirmation_id: thumbStatus,
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

  // Toggle thumb status and save to backend
  const toggleThumb = async (voterId) => {
    try {
      const voter = voters.find((item) => item.voter_id === voterId);

      if (!voter) {
        Alert.alert('Error', 'Voter not found');
        return;
      }

      const updatedThumbStatus = voter.voted === 1 ? null : 1;

      const updateResponse = await updateVoterThumbStatus(voterId, updatedThumbStatus);

      if (updateResponse) {
        setVoters((prevVoters) =>
          prevVoters.map((item) =>
            item.voter_id === voterId
              ? { ...item, voted: updatedThumbStatus === 1 ? 1 : null }
              : item
          )
        );

        setFilteredVoters((prevFiltered) =>
          prevFiltered.map((item) =>
            item.voter_id === voterId
              ? { ...item, voted: updatedThumbStatus === 1 ? 1 : null }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling thumb status:', error.message);
      Alert.alert('Error', 'Failed to toggle thumb status. Please try again.');
    }
  };

  // Render each voter item
  const renderItem = ({ item }) => {
    const backgroundColor = getColorByFavourId(item.voter_favour_id);

    return (
      <Pressable onPress={() => handleVoterPress(item)}>
        <View
          style={[
            styles.voterItem,
            { backgroundColor: backgroundColor }
          ]}
        >
          <View style={styles.voterDetails}>
            <View style={{
              borderRightWidth: 1, borderColor: 'black',
              flex: 0.17, alignItems: 'center',
            }}>
              <Text>{item.voter_id}</Text>
            </View>
            <Text style={{ flex: 0.75, fontSize: 16 }}>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
          </View>


          <Pressable onPress={() => toggleThumb(item.voter_id)}>
            <MaterialIcons
              name={item.voted === 1 ? "thumb-up" : "thumb-up-off-alt"}
              size={24}
              color={item.voted === 1 ? "black" : "black"}
            />
          </Pressable>
        </View>
      </Pressable>
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
          placeholder={language === 'en' ? 'Search by voter’s name or ID' : 'मतदाराचे नाव किंवा ओळखपत्राने शोधा'}
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

      <EditVoterForm
        isVisible={isModalVisible}
        onClose={handleCloseEditForm}
        selectedVoter={selectedVoter}
        onEditVoter={handleSelectedVoterDetails}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'white'
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
    borderWidth: 1,
    borderColor: '#919090',
    paddingRight: 5
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
