import React, { useState, useEffect } from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const CastModal = ({ isVisible, onClose, onAssignCaste, selectedVoters }) => {
  const [castes, setCastes] = useState([]);
  const [selectedCasteId, setSelectedCasteId] = useState(null);

  useEffect(() => {
    if (isVisible) {
      axios
        .get('http://192.168.1.24:8000/api/cast/')
        .then(response => {
          setCastes(response.data);
        })
        .catch(error => {
          console.error('Error fetching castes:', error);
        });
    }
  }, [isVisible]);

  const assignCasteToSelectedVoters = () => {
    if (!selectedCasteId) {
      Alert.alert('Error', 'Please select a caste before submitting.');
      return;
    }

    const payload = {
      voter_ids: selectedVoters,
      voter_cast_id: selectedCasteId,
    };

    axios
      .post('http://192.168.1.24:8000/api/assign_voter_cast/', payload)
      .then(response => {
        Alert.alert('Success', 'Caste assigned successfully!');
        onAssignCaste(selectedCasteId); // Callback to notify parent about the caste assignment
        onClose(); // Close the modal
      })
      .catch(error => {
        console.error('Error assigning caste:', error);
        Alert.alert('Error', 'Failed to assign caste. Please try again.');
      });
  };

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Assign Caste</Text>
          <View style={styles.listContainer}>
            <FlatList
              data={castes}
              keyExtractor={(item) => item.cast_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.casteItem,
                    selectedCasteId === item.cast_id && styles.selectedCasteItem,
                  ]}
                  onPress={() => setSelectedCasteId(item.cast_id)}
                >
                  <Text style={styles.casteName}>
                    {`${item.cast_id}. ${item.cast_name}`}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={assignCasteToSelectedVoters}
          >
            <Text style={styles.modalButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listContainer: {
    maxHeight: 250,
    width: '100%',
  },
  casteItem: {
    paddingVertical: 5,
    paddingLeft: 5,
    width: '100%',
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCasteItem: {
    borderColor: '#3C4CAC',
  },
  casteName: {
    fontSize: 16,
    color: 'black',
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#3C4CAC',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#F04393',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CastModal;
