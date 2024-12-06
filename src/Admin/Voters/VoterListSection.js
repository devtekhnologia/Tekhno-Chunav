import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TextInput } from 'react-native';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { width } = Dimensions.get('window');

const VoterListSection = ({ voters, filteredVoters, searchQuery, handleSearch }) => {
  const { language } = useContext(LanguageContext);
  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderItem = ({ item }) => (
    <View style={styles.voterItem}>
      <Text style={styles.voterId}>{item.voter_id || 'No ID'}</Text>
      <Text style={styles.voterName}>{toTitleCase(item.voter_name) || 'No Name'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder={language === 'en' ? 'search by voter’s name or ID' : 'मतदाराचे नाव किंवा आयडी द्वारे शोधा'}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Voter List */}
      <FlatList
        data={filteredVoters}
        keyExtractor={(item) => item.voter_id.toString()}
        renderItem={renderItem}
        style={styles.voterList}
        ListHeaderComponent={loading && <LoadingListComponent />}
        ListEmptyComponent={!loading && <EmptyListComponent />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  searchBar: {
    height: 40,
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
  },
  voterList: {
    width: '100%',
    marginTop: 20,
  },
  voterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  voterId: {
    fontSize: 16,
    color: 'blue',
    flex: 0.5,
    textAlign: 'center',
  },
  voterName: {
    fontSize: 16,
    color: '#666',
    flex: 2,
    textAlign: 'left',
    fontWeight: 'bold',
  },
});

export default VoterListSection;
