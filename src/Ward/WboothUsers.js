import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import WardHeaderFooter from './WardHeaderFooter';
import { LanguageContext } from '../ContextApi/LanguageContext';
import { WardUserContext } from '../ContextApi/WardUserContext';
import EmptyListComponent from '../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../ReusableCompo/LoadingListComponent';


const scaleFontSize = (size) => Math.round(size * width * 0.0025);
const { width, height } = Dimensions.get('screen');

export default function WboothUsers() {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { wardUserId } = useContext(WardUserContext);
  const [users, setUsers] = useState([]);
  const [searchedValue, setSearchedValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://192.168.1.24:8000/api/user_booth_details_by_prabhag_user/${wardUserId}/`);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error fetching booth users:', error.toString ? error.toString() : 'Unknown error');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wardUserId) {
      fetchUsers();
    }
  }, [wardUserId]);

  const searchedUsers = users.filter(user =>
    (user.user_name && user.user_name.toString().includes(searchedValue)) ||
    (user.user_id && user.user_id.toString().includes(searchedValue))
  );

  const deleteUser = async (wardUserId) => {
    try {
      const response = await axios.post('http://192.168.1.24:8000/api/delete_user/', {
        user_id: wardUserId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 204) {
        await fetchUsers();
        Alert.alert('Success', 'User has been deleted successfully.');
      } else {
        Alert.alert('Error', 'Failed to delete the user.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the user.');
    }
  };

  const handleLongPressDelete = (wardUserId) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteUser(wardUserId),
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="grey" />
        <TextInput
          value={searchedValue}
          onChangeText={text => setSearchedValue(text)}
          placeholder={language === 'en' ? "Search by voter’s name or ID" : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={searchedUsers}
        keyExtractor={(item) => item.user_id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.userItem}
            onLongPress={() => handleLongPressDelete(item.user_id)}
          >
            <View style={styles.userDetails}>
              <Text style={styles.wardUserId}>{item.user_id}</Text>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <Text>{item.user_name}</Text>
                <Text style={styles.phoneText}>Ph. No: {item.user_phone}</Text>
              </View>
            </View>
            <Pressable onPress={() => { navigation.navigate('Approve Survey', { wardUserId: item.user_id }) }}>
              <MaterialCommunityIcons name="arrow-right-bold-box" size={height * 0.04} color="#0077b6" />
            </Pressable>
          </Pressable>
        )}
        ListHeaderComponent={loading && <LoadingListComponent />}
        ListEmptyComponent={!loading && <EmptyListComponent />}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'white',
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
    columnGap: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
  },
  userItem: {
    flex: 1,
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.2,
  },
  userDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  wardUserId: {
    borderWidth: 1,
    borderColor: 'blue',
    width: 30,
    textAlign: 'center',
    borderRadius: 3,
    fontWeight: '700',
  },
  phoneText: {
    color: '#565D6D',
    fontSize: 11,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
