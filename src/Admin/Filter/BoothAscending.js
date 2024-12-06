import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Animated, Alert } from 'react-native';
import axios from 'axios';

export default function BoothAscending() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    fetchBoothData();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchBoothData();
    }, 60000);

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, []);

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const fetchBoothData = () => {
    setLoading(true);
    axios.get('http://192.168.1.24:8000/api/booth_voting_percentage/')
      .then(response => {

        const sortedData = response.data.sort((a, b) => a.voted_percentage - b.voted_percentage);
        setData(sortedData);
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', `Error fetching data: ${error}`);

        setLoading(false);
      });
  };

  const filteredData = data.filter((item) =>
    item.booth_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStageColor = (percentage) => {
    if (percentage <= 0) return 'red';
    if (percentage <= 25) return 'yellow';
    return 'green';
  };

  const renderItem = ({ item }) => {
    const color = getStageColor(item.voted_percentage);


    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        })
      ])
    ).start();

    const borderColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fff', color], // Transition from white to the stage color
    });

    return (
      <TouchableOpacity style={[styles.card, { borderBottomColor: color, borderBottomWidth: 4 }]}>
        <View style={styles.leftSection}>
          <Text style={styles.cardTitle}>Booth ID: {item.booth_id}</Text>
          <Text style={styles.cardDescription}>Booth Name: {toTitleCase(item.booth_name)}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.cardTitle}>{item.voted_percentage}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (

    <View style={styles.container}>

      {/* Show loading spinner while data is being fetched */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.booth_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
          refreshing={refreshing}
          onRefresh={fetchBoothData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  searchBar: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 4, // Will be controlled by the percentage stage color
  },
  leftSection: {
    flex: 1,
    width: '70%',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
