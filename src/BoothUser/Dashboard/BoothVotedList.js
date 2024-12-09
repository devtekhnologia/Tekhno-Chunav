import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import { toTitleCase } from '../../ReusableCompo/Functions/toTitleCaseConvertor';
import { fetchVoterDetails } from '../../ReusableCompo/Functions/FetchVoterDetails';
import VoterDetailsPopUp from '../../ReusableCompo/VoterDetailsPopUp';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { height, width } = Dimensions.get('window');

export default function BoothVotedList({ route, navigation }) {
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

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const response = await axios.get(`http://192.168.1.24:8000/api/voted_voters_list_By_booth_user/${buserId}/1/?lang=${language === 'en' ? 'en' : 'mr'}/`);
        if (response.data.voters && Array.isArray(response.data.voters)) {
          console.log(response.data.voters);
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
  }, [buserId, language]); // Trigger the useEffect hook whenever the buserId or language changes


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


  const handleVoterPress = async (voter) => {
    setClickedVoter(voter.voter_id);
    const response = await fetchVoterDetails(voter.voter_id);
    console.log(response.data);
    setSelectedVoter(response.data); // Set selected voter details
    setIsModalVisible(true); // Show the modal

    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const renderItem = ({ item }) => {
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
      <Pressable onPress={() => handleVoterPress(item)}>
        <Animated.View
          style={[
            styles.voterItem, { backgroundColor: color }
          ]}
        >
          <View style={styles.voterDetails}>
            <View style={{
              borderRightWidth: 1, borderColor: '#D9D9D9',
              width: 60, alignItems: 'center',
            }}>
              <Text>{item.voter_id}</Text>
            </View>
            <Text>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
          </View>
        </Animated.View>
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
        ListEmptyComponent={!loading && <EmptyListComponent />}
      />

      {/* Modal to show selected voter details */}
      <VoterDetailsPopUp
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedVoter={selectedVoter}
      />
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
});
