import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { toTitleCase } from '../../ReusableCompo/Functions/toTitleCaseConvertor';

export default function FamilyModal({
  visible,
  members,
  selectedVoter,
  setModalVisible,
  handleVoterSelect,
  setMembers,
  refreshFamilyGroups, 
  language
}) {
  const [removalLoading, setRemovalLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleRemoveVoter = async () => {
    if (!selectedMember) {
      Alert.alert('Error', 'No voter selected');
      return;
    }

    setRemovalLoading(true);
    try {
      const response = await axios.patch(
        `http://192.168.1.38:8000/api/remove_voter_from_family_group/${selectedMember.voter_id}/`
      );

      if (response.data.message === "Voter group ID updated to NULL") {
        Alert.alert('Success', 'Voter removed from the group successfully');
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.voter_id !== selectedMember.voter_id)
        );
        setSelectedMember(null);
        refreshFamilyGroups();
      } else {
        Alert.alert('Error', 'Unexpected response from the server');
      }
    } catch (error) {
      console.error('Error removing voter:', error);
      Alert.alert('Error', 'Failed to remove voter');
    } finally {
      setRemovalLoading(false);
      setModalVisible(false);
    }
  };

  const handleToggleSelection = (item) => {
    if (selectedMember && selectedMember.voter_id === item.voter_id) {
      setSelectedMember(null);
    } else {
      setSelectedMember(item);
    }
  };

  const renderMember = ({ item }) => (
    <TouchableOpacity
      style={[styles.memberItem, selectedMember && selectedMember.voter_id === item.voter_id && styles.selectedMemberItem]}
      onPress={() => handleToggleSelection(item)}
    >
      <Text style={styles.memberText}>
        {language === 'en' ? 'ID' : 'क्र.'}: {item.voter_id}
      </Text>
      <Text style={styles.memberText}>
        {language === 'en' ? 'Name' : 'नाव'}: {language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>
              {language === 'en' ? 'Group Members' : 'कुटुंबातील सदस्य'}
            </Text>
            <TouchableOpacity style={styles.numberButton}>
              <Text style={styles.numberButtonText}>{members.length}</Text>
            </TouchableOpacity>
          </View>

          {removalLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={members}
              keyExtractor={(item) => item.voter_id.toString()}
              renderItem={renderMember}
            />
          )}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveVoter}
            disabled={!selectedMember}
          >
            <Text style={styles.removeButtonText}>
              {language === 'en' ? 'Remove Voter' : 'मतदार काढून टाका'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>{language === 'en' ? 'Close' : 'बंद करा'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '80%',
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  numberButton: {
    backgroundColor: '#FF6347',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberItem: {
    padding: 10,
  },
  selectedMemberItem: {
    backgroundColor: '#d3d3d3', // Gray background for selected member
  },
  memberText: {
    fontSize: 17,
  },
  removeButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
