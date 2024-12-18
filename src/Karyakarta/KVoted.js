import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Dimensions, Pressable, Animated, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { KaryakartaContext } from '../ContextApi/KaryakartaContext';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';
import { toTitleCase } from '../ReusableCompo/Functions/toTitleCaseConvertor';

const { height, width } = Dimensions.get('window');

export default function KVoted({ route, navigation }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { KuserId } = useContext(KaryakartaContext);
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
        const response = await axios.get(`http://192.168.1.38:8000/api/voter_status/${KuserId}/1/
 `);
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
  }, [KuserId, language]); // Trigger the useEffect hook whenever the KuserId or language changes


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
    axios.get(`http://192.168.1.38:8000/api/voters/${voter_id}`)
      .then(response => {
        setSelectedVoter(response.data); // Set selected voter details
        setIsModalVisible(true); // Show the modal
      })
      .catch(error => {
        console.error('Error fetching voter details:', error);
        Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
      });
  };

  const renderItem = ({ item }) => {
    const isClicked = item.voter_id === clickedVoter;
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
      <Pressable onPress={() => handleVoterPress(item)}>
        <Animated.View
          style={[
            styles.voterItem, { backgroundColor },
            isClicked && {
              transform: [{ scale: animatedValue }], // Apply the animation
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 9,
              elevation: 10, // Add shadow for Android
            }
          ]}
        >
          <View style={styles.voterDetails}>
            <View style={{
              borderRightWidth: 1, borderColor: '#D9D9D9',
              width: 60, alignItems: 'center',
            }}>
              <Text style={{ fontSize: 16 }}>{item.voter_id}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 16 }}>{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
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
});
