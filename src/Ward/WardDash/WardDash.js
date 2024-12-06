import React, { useContext, useEffect, useState, useRef } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import WardVotingBarStats from './WardVotingBarStats.js';
import WardHeaderFooter from '../WardHeaderFooter.js';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { LanguageContext } from '../../ContextApi/LanguageContext.js';
import { WardUserContext } from '../../ContextApi/WardUserContext.js';

const { height, width } = Dimensions.get('screen');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);

function WardDash({ toggleSidebar }) {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const navigation = useNavigation();
  const { wardUserId } = useContext(WardUserContext);
  const [totalVoters, setTotalVoters] = useState('');
  const [totalTowns, setTotalTowns] = useState('000');
  const [totalBoothsCount, setTotalBoothsCount] = useState('000');
  const [totalUsers, setTotalUsers] = useState('000');
  const [totalVoted, setTotalVoted] = useState('000');
  const [totalNonVoted, setTotalNonVoted] = useState('000');
  const [modalVisible, setModalVisible] = useState(false);
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const iconRef = useRef(null);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const voterResponse = await axios.get(`http://192.168.1.24:8000/api/get_voterlist_by_prabhag_user/${wardUserId}/`);
      setTotalVoters(voterResponse.data.length.toString());

      const boothResponse = await axios.get(`http://192.168.1.24:8000/api/booth_details_by_prabhag_user/${wardUserId}/`);
      setTotalBoothsCount(boothResponse.data.length.toString());

      const userResponse = await axios.get(`http://192.168.1.24:8000/api/user_booth_details_by_prabhag_user/${wardUserId}/`);
      setTotalUsers(userResponse.data.length.toString());

      const votedResponse = await axios.get(`http://192.168.1.24:8000/api/voter_details_by_confirmation/${wardUserId}/1/`);
      setTotalVoted(votedResponse.data.length.toString());

      const nonVotedResponse = await axios.get(`http://192.168.1.24:8000/api/voter_details_by_confirmation/${wardUserId}/2/`);
      setTotalNonVoted(nonVotedResponse.data.length.toString());
    } catch (error) {
      Alert.alert('Error', `Error fetching data: ${error}`);

    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (wardUserId) {
      fetchData();
    }
  }, [wardUserId]);

  const showModal = () => {
    if (iconRef.current) {
      iconRef.current.measure((x, y, width, height, pageX, pageY) => {
        setIconPosition({ x: pageX, y: pageY + height });
        setModalVisible(true);
      });
    }
  };

  const handleOutsideClick = () => {
    if (modalVisible) setModalVisible(false);
  };

  const onRefresh = () => {
    fetchData();
  };

  return (
    <>
      <ScrollView style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ marginVertical: '3%' }} >
          <Pressable onPress={() => navigation.navigate('Voters List')}>
            <LinearGradient colors={['#3C4CAC', '#F04393']} locations={[0.3, 1]} style={styles.gradient}>
              <Text style={styles.gradientText}>
                {language === 'en' ? 'Total Voters' : 'एकूण मतदार'}
              </Text>
              <Text style={styles.gradientText}>{totalVoters}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Pressable onPress={() => navigation.navigate('Total Booths')} style={[styles.statsBox, styles.statsBoxBlue]}>
              <Text style={styles.statsLabel}>
                {language === 'en' ? 'Total Booths' : 'एकूण बूथ'}
              </Text>
              <Text style={styles.statsValue}>{totalBoothsCount}</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Booth Users')} style={[styles.statsBox, styles.statsBoxGreen]}>
              <Text style={styles.statsLabel}>
                {language === 'en' ? 'Total Users' : 'एकूण कार्यकर्ता'}
              </Text>
              <Text style={styles.statsValue}>{totalUsers}</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <Pressable
              style={[styles.statsBox, styles.statsBoxYellow]}
              onPress={() => navigation.navigate('Total Voted', { wardUserId })}
            >
              <Text style={styles.statsLabel}>
                {language === 'en' ? 'Total Voted' : 'एकूण मतदान'}
              </Text>
              <Text style={styles.statsValue}>{totalVoted}</Text>
            </Pressable>

            <Pressable
              style={[styles.statsBox, styles.statsBoxCyan]}
              onPress={() => navigation.navigate('Total Non Voted', { wardUserId })}
            >
              <Text style={styles.statsLabel}>
                {language === 'en' ? 'Total Non-Voted' : 'एकूण मतदान बाकी'}
              </Text>
              <Text style={styles.statsValue}>{totalNonVoted}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.votingStatsContainer}>
          <View style={styles.votingStatsBox}>
            <WardVotingBarStats />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default WardDash;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerContainer: {
    width: "100%",
    justifyContent: 'center',
  },
  title: {
    fontSize: height * 0.02,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 5,
  },
  gradientContainer: {
    height: height * 0.1,
    borderRadius: 10,
    paddingVertical: '2%',
    width: '100%',
  },
  gradient: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2%',
  },
  gradientText: {
    fontSize: width * 0.05,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  statsContainer: {
    height: height * 0.20,
    marginVertical: "3%",
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.08,
    marginVertical: "1.8%",
    columnGap: width * 0.035
  },
  statsBox: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  statsBoxBlue: {
    backgroundColor: '#DAE3FF',
  },
  statsBoxGreen: {
    backgroundColor: '#D3FFDB',
  },
  statsBoxYellow: {
    backgroundColor: '#FFEFB2',
  },
  statsBoxCyan: {
    backgroundColor: '#B8F7FE',
  },
  statsLabel: {
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: width * 0.05,
    fontWeight: '700',
  },
  votingStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.4,
  },
  votingStatsBox: {
    flex: 1,
    borderWidth: 0.1,
    borderRadius: 1,
    marginHorizontal: '1%',
    paddingVertical: "2%",
  },
});
