import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import KVotingBarStats from './KVotingBarStats';
import axios from 'axios';
import { KaryakartaContext } from '../ContextApi/KaryakartaContext';
import { LanguageContext } from '../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('window');

export default function KDash() {
  const { KuserId } = useContext(KaryakartaContext);
  const [totalVotersCount, setTotalVotersCount] = useState(0);
  const { language } = useContext(LanguageContext)
  const [totalVotedCount, setTotalVotedCount] = useState(0);
  const [totalNonVotedCount, setTotalNonVotedCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (KuserId) {
      fetchAllCounts();
    }
  }, [KuserId]);

  const fetchAllCounts = async () => {
    await fetchVotersCount();
    await fetchVotedCount();
    await fetchNonVotedCount();
  };

  const fetchVotersCount = async () => {
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/voters_by_group_user/${KuserId}/`);
      const votersData = response.data?.voters || [];
      setTotalVotersCount(votersData.length);
    } catch (error) {
      console.error('Error fetching voters count:', error);
    }
  };

  const fetchVotedCount = async () => {
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/voter_status/${KuserId}/1/`);
      const votedData = response.data || [];
      setTotalVotedCount(votedData.length);
    } catch (error) {
      console.error('Error fetching voted count:', error);
    }
  };

  const fetchNonVotedCount = async () => {
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/voter_status/${KuserId}/2/`);
      const nonVotedData = response.data || [];
      setTotalNonVotedCount(nonVotedData.length);
    } catch (error) {
      console.error('Error fetching non-voted count:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllCounts();
    setRefreshing(false);
  };

  const handleTotalVotersClick = () => {
    navigation.navigate('Total Voters');
  };

  const handleTotalVotedClick = () => {
    navigation.navigate('KVoted');
  };

  const handleTotalNonVotedClick = () => {
    navigation.navigate('KNVoted');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.cardContainer}>
          <Pressable onPress={handleTotalVotersClick}>
            <LinearGradient colors={['#3C4CAC', '#F04393']} locations={[0.3, 1]} style={styles.gradient}>
              <Text style={styles.gradientText}>{language === 'en' ? 'Total Voters' : 'एकूण मतदार'}</Text>
              <Text style={styles.gradientText}>{totalVotersCount}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Pressable style={[styles.statsBox, styles.statsBoxYellow]} onPress={handleTotalVotedClick}>
              <Text style={styles.statsLabel}>{language === 'en' ? 'Total Voted' : 'मतदान झालेले'}</Text>
              <Text style={styles.statsValue}>{totalVotedCount}</Text>
            </Pressable>

            <Pressable style={[styles.statsBox, styles.statsBoxCyan]} onPress={handleTotalNonVotedClick}>
              <Text style={styles.statsLabel}>{language === 'en' ? 'Total Non-Voted' : 'मतदान न झालेले'}</Text>
              <Text style={styles.statsValue}>{totalNonVotedCount}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.votingStatsContainer}>
          <View style={styles.votingStatsBox}>
            <KVotingBarStats />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardContainer: {
    height: height * 0.18,
    borderRadius: 10,
    paddingVertical: '3%',
    width: '100%',
    marginBottom: 10,
  },
  gradient: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '3%',
  },
  gradientText: {
    fontSize: width * 0.055,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  statsContainer: {
    height: height * 0.15,
    marginVertical: '3%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '3%',
  },
  statsBox: {
    width: '47%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4%',
    elevation: 5,
  },
  statsBoxYellow: {
    backgroundColor: '#F5F59C',
  },
  statsBoxCyan: {
    backgroundColor: '#A1DFE3',
  },
  statsLabel: {
    fontSize: width * 0.045,
    textAlign: 'center',
  },
  statsValue: {
    fontSize: width * 0.065,
    fontWeight: '700',
    textAlign: 'center',
    color: 'black',
  },
  votingStatsContainer: {
    height: height * 0.40,
  },
  votingStatsBox: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  logoutText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});
