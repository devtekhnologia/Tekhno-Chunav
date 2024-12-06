import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ActivityIndicator, Animated, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { BoothUserContext } from '../../ContextApi/BuserContext';

const { width, height } = Dimensions.get('window');

const scaleFontSize = (size) => Math.round(size * width * 0.0025);

const BoothDashbord = ({ navigation, toggleSidebar }) => {
  const [voterCounts, setVoterCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { buserId } = useContext(BoothUserContext);
  const [totalVoted, setTotalVoted] = useState('000');
  const [totalNVoted, setNTotalVoted] = useState('000');
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVoterData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.1.24:8000/api/get_voters_by_user_wise/${buserId}/`);
      const voters = response.data.voters || [];
      const totalVoters = voters.length;
      const ours = voters.filter(voter => voter.voter_favour_id === 1).length;
      const against = voters.filter(voter => voter.voter_favour_id === 2).length;
      const doubted = voters.filter(voter => voter.voter_favour_id === 3).length;
      const pending = totalVoters - (ours + against + doubted);

      setVoterCounts({
        total: totalVoters,
        ours: ours,
        against: against,
        doubted: doubted,
        pending: pending,
      });

      const voteCountResponse = await axios.get(
        `http://192.168.1.24:8000/api/get_voted_and_non_voted_count_by_booth_user/${buserId}/`
      );

      setTotalVoted(voteCountResponse.data.voted_count.toString());
      setNTotalVoted(voteCountResponse.data.non_voted_count.toString());

    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing once data is fetched
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVoterData();
  };

  useEffect(() => {
    if (buserId) {
      fetchVoterData();
    }
  }, [buserId]);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      Animated.timing(rotateAnim).stop();
    }
  }, [loading]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.constituencyText}>
            {language === 'en' ? 'Washim Constituency' : 'वाशिम मतदारसंघ'}
          </Text>
          <Text style={styles.userIdText}>
            {language === 'en' ? 'User Id: ' : 'वापरकर्ता आयडी: '} : {buserId}
          </Text>
        </View>
        <View style={styles.loadingGraphsContainer}>
          <Animated.View style={[styles.graphWrapper, { transform: [{ rotate }] }]}>
            <Progress.Circle
              size={width * 0.22}
              indeterminate
              thickness={15}
              color="gray"
              unfilledColor="#e0e0e0"
              borderWidth={0}
            />
          </Animated.View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchVoterData}>
          <Text style={styles.retryText}>
            {language === 'en' ? 'Retry' : 'पुन्हा प्रयत्न करा'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      scrollEnabled={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity style={styles.totalVotersContainer} onPress={() => navigation.navigate('Voters List')}>
        <LinearGradient
          colors={['#3C4CAC', '#F04393']}
          locations={[0.3, 1]}
          style={styles.gradient}
        >
          <Text style={styles.gradientText}>
            {language === 'en' ? 'Total Voters' : 'एकूण मतदार'}
          </Text>
          <Text style={styles.gradientText}>{voterCounts.total}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <TouchableOpacity style={[styles.statsBox, styles.statsBoxYellow]}
          onPress={() => {
            navigation.navigate('Voted', { buserId })
          }}>
          <Text style={styles.statsLabel}>
            {language === 'en' ? 'Total Voted' : 'एकूण मतदान झालेले'}
          </Text>
          <Text style={styles.statsValue}>{totalVoted}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.statsBox, styles.statsBoxCyan]}
          onPress={() => navigation.navigate('Non Voted', { buserId })}>
          <Text style={styles.statsLabel}>
            {language === 'en' ? 'Total Non-Voted' : 'मतदान न झालेले'}
          </Text>
          <Text style={styles.statsValue}>{totalNVoted}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.overviewText}>
        {language === 'en' ? 'Overview' : 'सारांश'}
      </Text>

      <View style={styles.graphsContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.graphWrappergreen}
            onPress={() => navigation.navigate('Relational Voters', {
              relationId: 1,
              ScreenName: language === 'en' ? 'Favours Voters' : 'समर्थक मतदार'
            })}>
            <Progress.Circle
              size={width * 0.22}
              progress={voterCounts.ours / voterCounts.total}
              thickness={15}
              showsText
              color="green"
              unfilledColor="#b3ffba"
              borderWidth={0}
              strokeCap="round"
              formatText={() => `${voterCounts.ours}`}
            />
            <Text style={styles.graphText}>
              {language === 'en' ? 'Favours' : 'समर्थक'}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.graphWrapperred} onPress={() => navigation.navigate('Relational Voters', {
            relationId: 2,
            ScreenName: language === 'en' ? 'Against Voters' : 'विरुद्ध मतदार'
          })}>
            <Progress.Circle
              size={width * 0.22}
              progress={voterCounts.against / voterCounts.total}
              thickness={15}
              showsText
              color="red"
              unfilledColor="#ffcccc"
              borderWidth={0}
              strokeCap="round"
              formatText={() => `${voterCounts.against}`}
            />
            <Text style={styles.graphText}>
              {language === 'en' ? 'Against' : 'विरुद्ध'}
            </Text>
          </TouchableOpacity>
        </View>



        <View style={styles.row}>

          <TouchableOpacity style={styles.graphWrapperyellow}
            onPress={() => navigation.navigate('Relational Voters', { relationId: 3, ScreenName: language === 'en' ? 'Doubted Voters' : 'संशयित मतदार' })}>
            <Progress.Circle
              size={width * 0.22}
              progress={voterCounts.doubted / voterCounts.total}
              thickness={15}
              showsText
              color="#f7ba11"
              unfilledColor="#fff0b3"
              borderWidth={0}
              strokeCap="round"
              formatText={() => `${voterCounts.doubted}`}
            />
            <Text style={styles.graphText}>
              {language === 'en' ? 'Doubted' : 'संशयित'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.graphWrapperblack} onPress={() => navigation.navigate('Relational Voters', {
            relationId: 0,
            ScreenName: language === 'en' ? 'Pending Voters' : 'बाकी मतदार'
          })}>
            <Progress.Circle
              size={width * 0.22}
              progress={voterCounts.pending / voterCounts.total}
              thickness={15}
              showsText
              color="black"
              unfilledColor="#bababa"
              borderWidth={0}
              strokeCap="round"
              formatText={() => `${voterCounts.pending}`}
            />
            <Text style={styles.graphText}>
              {language === 'en' ? 'Pending' : 'बाकी'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  constituencyText: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    color: '#3C4CAC',
  },
  userIdText: {
    fontSize: scaleFontSize(20),
    color: '#000000',
  },
  totalVotersContainer: {
    height: height * 0.15,
    borderRadius: 10,
    width: '100%',
    padding: 20,
  },
  gradient: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2%',
    height: '100%',
  },
  gradientText: {
    fontSize: scaleFontSize(20),
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  overviewText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginLeft: width * 0.05,
    marginBottom: height * 0.02,
    marginTop: height * 0.015,
  },
  graphsContainer: {
    flex: 1,
    marginBottom: height * 0.1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.04,
  },
  graphWrappergreen: {
    backgroundColor: '#D9F4E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
    elevation: 5

  },
  graphWrapperyellow: {
    backgroundColor: '#FFFAE1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
    elevation: 5

  },
  graphWrapperred: {
    backgroundColor: '#FDDDDD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
    elevation: 5
  },
  graphWrapperblack: {
    backgroundColor: '#DEDEDE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
    elevation: 5

  },
  graphText: {
    fontSize: scaleFontSize(14),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
  loadingGraphsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  errorText: {
    fontSize: scaleFontSize(18),
    color: 'red',
    textAlign: 'center',
  },
  retryText: {
    fontSize: scaleFontSize(16),
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.1,
    marginVertical: "1.8%",
    marginHorizontal: '5%',
    columnGap: 15,
  },
  statsBox: {
    // height: height * 0.1,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
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
    fontSize: 16,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: width * 0.05,
    fontWeight: '700',
  },
});

export default BoothDashbord;
