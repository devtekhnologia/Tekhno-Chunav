import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { width } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);

export default function CasteList({ navigation }) {
  const { language } = useContext(LanguageContext);
  const { buserId } = useContext(BoothUserContext);
  const [voters, setVoters] = useState([]);
  const [selectedCast, setSelectedCast] = useState(null);
  const [colorLegendModalVisible, setColorLegendModalVisible] = useState(false);
  const [selectedVoterId, setSelectedVoterId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCasteData = async () => {
      try {
        const response = await axios.get('http://192.168.1.38:8000/api/cast/');
        const casteData = response.data.map(cast => ({
          label: `${cast.cast_id} - ${cast.cast_name}`,
          value: cast.cast_id,
        }));
        setItems(casteData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load caste data');
      }
    };

    fetchCasteData();
  }, []);

  const fetchVotersByCaste = async (castId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.1.38:8000/api/get_voters_by_booth_user_and_cast/${buserId}/${castId}/`);
      setVoters(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load voters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCast) {
      fetchVotersByCaste(selectedCast);
    }
  }, [selectedCast]);

  const openColorLegendModal = (voterId) => {
    setSelectedVoterId(voterId);
    setColorLegendModalVisible(true);
  };

  const closeColorLegendModal = () => {
    setSelectedVoterId(null);
    setColorLegendModalVisible(false);
  };

  const handleColorSelection = async (selectedColor) => {
    if (!selectedVoterId) return; // Ensure that a voter is selected
  
    const colorMapping = {
      '#188357': { voterFavourId: 1, backgroundColor: '#E4F8E4' }, // Green
      '#FF3030': { voterFavourId: 2, backgroundColor: '#FFE4E4' }, // Red
      '#FBBE17': { voterFavourId: 3, backgroundColor: '#FFF5D7' }, // Yellow
      '#1E90FF': { voterFavourId: 4, backgroundColor: '#D8E9FF' }, // Blue
    };
  
    const { voterFavourId, backgroundColor } = colorMapping[selectedColor] || {};
  
    if (!voterFavourId) {
      Alert.alert('Error', 'Invalid color selection.');
      return;
    }
  
    try {
      const response = await axios.put(`http://192.168.1.38:8000/api/favour/`, {
        voter_ids: [selectedVoterId], 
        voter_favour_id: voterFavourId,
      });
  
      if (response.status === 200) {
        setVoters((prevVoters) =>
          prevVoters.map((voter) =>
            voter.voter_id === selectedVoterId
              ? { ...voter, color: backgroundColor } 
              : voter
          )
        );
        Alert.alert('Success', 'Color updated successfully.');
      } else {
        Alert.alert('Error', 'Failed to update color. Please try again later.');
      }
    } catch (error) {
      console.error('Error updating color:', error.message);
      Alert.alert('Error', 'An error occurred while updating the color.');
    }
  
    closeColorLegendModal();
  };
  

  const renderVoterItem = ({ item }) => (
    <View style={[styles.voterItem, { backgroundColor: item.color || '#FFFFFF' }]}>
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
      <TouchableOpacity style={styles.colorCircleContainer} onPress={() => openColorLegendModal(item.voter_id)}>
        <View style={styles.circle}></View>
      </TouchableOpacity>
    </View>
  );
  

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <DropDownPicker
        open={open}
        value={selectedCast}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedCast}
        setItems={setItems}
        placeholder={language === 'en' ? "Select Caste" : 'जात निवडा'}
        containerStyle={styles.picker}
      />

      {selectedCast && (
        <View style={styles.selectedCastContainer}>
          <Text style={styles.selectedCastText}>Caste: {selectedCast}</Text>
          <FlatList
            data={voters}
            keyExtractor={(item) => item.voter_id.toString()}
            renderItem={renderVoterItem}
            contentContainerStyle={styles.voterList}
            ListHeaderComponent={loading && <LoadingListComponent />}
            ListEmptyComponent={!loading && <EmptyListComponent />} />
        </View>
      )}

      <Modal
        visible={colorLegendModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeColorLegendModal}
      >
        <TouchableWithoutFeedback onPress={closeColorLegendModal}>
        <View style={styles.overlay}>
          <View style={styles.colorLegendModalContainer}>
            {[
              { color: '#188357', label: 'Favourable' },
              { color: '#FF3030', label: 'Non-Favourable' },
              { color: '#FBBE17', label: 'Doubted' },
              { color: '#1E90FF', label: 'Pro' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.legendItem} onPress={() => handleColorSelection(item.color)}>
                <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    backgroundColor: 'white'
  },
  closeCircle: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleContainer:{
    // backgroundColor:'red',
    marginLeft:'3%'
  },
  circle: {
    width: 25,
    height: 25,
    backgroundColor: '#737373',
    borderRadius: 50,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  selectedCastContainer: {
    flex: 1,
  },
  selectedCastText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#3C4CAC',
  },
  voterList: {
    paddingVertical: 10,
    paddingBottom: 100,
  },
  voterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',

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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLegendModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
  },
});
