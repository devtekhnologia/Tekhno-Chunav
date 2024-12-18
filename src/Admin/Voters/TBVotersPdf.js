import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated, Easing, Modal, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';


const { width, height } = Dimensions.get('screen')
export default function TBVotersPdf() {
  const { language } = useContext(LanguageContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [arrowAnimations, setArrowAnimations] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [removalLoading, setRemovalLoading] = useState(false);

  useEffect(() => {
    const fetchFamilyGroups = async () => {
      try {
        const response = await axios.get(`http://192.168.1.38:8000/api/get_family_groups_for_admin/`);
        if (response.status === 200) {
          setData(response.data);
          initializeArrowAnimations(response.data);
        } else {
          setError('Data not found');
        }
      } catch (error) {
        Alert.alert('Error fetching family group data:', error.toString ? error.toString() : 'Unknown error');
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    const initializeArrowAnimations = (groups) => {
      const animations = {};
      groups.forEach((group) => {
        animations[group.family_group_id] = new Animated.Value(0);
      });
      setArrowAnimations(animations);
    };

    fetchFamilyGroups();
  }, []);

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handlePress = async (id) => {
    setSelectedId(selectedId === id ? null : id);

    Animated.timing(arrowAnimations[id], {
      toValue: selectedId === id ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (selectedId !== id) {
      setModalLoading(true);
      setModalVisible(true);
      try {
        const response = await axios.get(`http://192.168.1.38:8000/api/get_voters_by_group_id/${id}/`);
        if (response.status === 200) {
          setMembers(response.data.voters);
        } else {
          // Handle unexpected status codes
          Alert.alert(`Failed to fetch voters. Status code: ${response.status}. Please try again.`);
        }
      } catch (error) {
        // Differentiate between error types
        if (error.response) {
          // The request was made and the server responded with a status code
          Alert.alert(`Error: ${error.response.data.message || 'Failed to fetch voters. Please try again.'}`);
        } else if (error.request) {
          // The request was made but no response was received
          Alert.alert('No response from the server. Please check your network connection and try again.');
        } else {
          // Something happened in setting up the request
          Alert.alert('An unexpected error occurred. Please try again.');
        }
      } finally {
        setModalLoading(false);
      }
    }
  };



  const handleVoterSelect = (voter) => {
    setSelectedVoter(voter);
    setConfirmModalVisible(true);
  };

  const handleRemoveVoter = async () => {
    setRemovalLoading(true);
    try {

      console.log('Removing voter with ID:', selectedVoter.voter_id);

      const response = await axios.patch(`http://192.168.1.38:8000/api/remove_voter_from_family_group/${selectedVoter.voter_id}/`, {
        voter_id: selectedVoter.voter_id,
      });

      console.log('API response:', response);

      if (response.status === 200) {
        Alert.alert('Success', 'Voter removed from the group successfully');

        setMembers(members.filter((member) => member.voter_id !== selectedVoter.voter_id));
      } else {
        Alert.alert('Error', 'Unexpected response from the server');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to remove voter from the group: ${error.message}`);
    } finally {
      setRemovalLoading(false);
      setConfirmModalVisible(false);
    }
  };

  const rotateArrow = (id) =>
    arrowAnimations[id]?.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    }) || '0deg';

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.family_group_id)}>
      <View style={styles.leftSection}>
        <Text style={styles.idText}>ID: {item.family_group_id}</Text>
        <Text style={styles.nameText}>Name: {toTitleCase(item.family_group_name)}</Text>
        <Text style={styles.contactText}>Contact: {item.family_group_contact_no}</Text>
      </View>
      <Animated.View style={{ transform: [{ rotate: rotateArrow(item.family_group_id) }] }}>
        <MaterialIcons name="arrow-forward-ios" size={24} color="#000" style={styles.arrowIcon} />
      </Animated.View>
    </TouchableOpacity>
  );

  const renderModalContent = () => {
    if (modalLoading) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }

    if (!members) {
      return <Text>No members found for this group.</Text>;
    }

    return (
      <FlatList
        data={members}
        keyExtractor={(item) => item.voter_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.memberItem} onPress={() => handleVoterSelect(item)}>
            <Text style={styles.memberText}>{language === 'en' ? 'ID' : 'क्र.'}:  {item.voter_id}</Text>
            <Text style={styles.memberText}>{language === 'en' ? 'Name' : 'नाव'}: {language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
            <Text style={styles.memberText}>{language === 'en' ? 'Contact' : 'संपर्क'}: {item.voter_contact_number || 'N/A'}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (

    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.family_group_id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={loading && <LoadingListComponent />}
          ListEmptyComponent={!loading && <EmptyListComponent />} />
      )}

      {/* Members Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{language === 'en' ? 'Family Members' : 'कुटुंब सदस्य'}</Text>
            <View style={{ alignSelf: 'center', flex: 1 }}>
              {renderModalContent()}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              setModalVisible(false)
              setMembers([])
            }}>
              <Text style={styles.closeButtonText}>{language === 'en' ? 'Close' : 'बंद करा'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal for Removal */}
      <Modal visible={confirmModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.actionModal}>
            <Text style={styles.modalTitle}>{language === 'en' ? 'Remove Voter' : 'मतदार काढून टाका'}</Text>
            <Text>{language === 'en' ? 'Are you sure you want to remove' : 'तुम्हाला काढायचे आहे का'} {selectedVoter?.voter_name} {language === 'en' ? 'from the group' : 'यानाकुटुंब गटातून?'}</Text>
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleRemoveVoter}
                disabled={removalLoading}
              >
                <Text style={styles.confirmButtonText}>
                  {removalLoading ? 'Removing...' : 'Remove'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmModalVisible(false)}
                disabled={removalLoading}
              >
                <Text style={styles.cancelButtonText}>{language === 'en' ? 'Cancel' : 'रद्द करा'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  card: {
    // backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginVertical: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    // elevation: 3,
  },
  leftSection: {
    flexDirection: 'column',
  },
  idText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    // marginTop: 5,
  },
  contactText: {
    fontSize: 16,
    color: '#888',
    // marginTop: 5,
  },
  arrowIcon: {
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
    height: '70%',
    alignSelf: 'center'
  },

  actionModal: {
    width: "70%",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  memberItem: {
    marginVertical: 10,
  },
  memberText: {
    fontSize: 16,
  },
  closeButton: {
    width: '80%',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
