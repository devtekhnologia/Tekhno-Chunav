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
        const response = await axios.get(`http://192.168.1.38:8000/api/voted_voters_list_By_booth_user/${buserId}/1/?lang=${language === 'en' ? 'en' : 'mr'}/`);

        if (response.data.voters && Array.isArray(response.data.voters)) {
          // Sort voters alphabetically by name (assuming the field is `voter_name`)
          const sortedVoters = response.data.voters.sort((a, b) => a.voter_name.localeCompare(b.voter_name));

          console.log(sortedVoters);
          setVoters(sortedVoters);
          setFilteredVoters(sortedVoters);
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
  }, [buserId, language]);



  useEffect(() => {
    const filtered = voters.filter(voter =>
        voter.voter_id?.toString().includes(search) ||
        (voter.voter_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (voter.voter_name_mar?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (voter.voter_serial_number?.toString() || '').includes(search.toLowerCase()) ||
        (voter.voter_id_card_number?.toLowerCase() || '').includes(search.toLowerCase())
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e0e0e0',
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
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
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
