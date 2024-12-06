import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View, RefreshControl, Alert, Animated } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import TownVotingBarStats from './TownVotingBarStats';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { height, width } = Dimensions.get('screen');

const TownDashboard = () => {
    const navigation = useNavigation();
    const { userId } = useContext(TownUserContext);
    const [totalVoters, setTotalVoters] = useState(0);
    const [finalTotalVoters, setFinalTotalVoters] = useState(0);
    const [totalVoted, setTotalVoted] = useState(0);
    const [finalTotalVoted, setFinalTotalVoted] = useState(0);
    const [totalNonVoted, setTotalNonVoted] = useState(0);
    const [finalTotalNonVoted, setFinalTotalNonVoted] = useState(0);
    const [totalBoothsCount, setTotalBoothsCount] = useState(0);
    const [finalTotalBoothsCount, setFinalTotalBoothsCount] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [finalTotalUsers, setFinalTotalUsers] = useState(0);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { language, toggleLanguage } = useContext(LanguageContext);
    const [loading, setLoading] = useState(false);


    const fetchData = async (url, setter, finalSetter) => {
        try {
            const response = await axios.get(url);
            const count = response.data.length;
            setter(count);
            finalSetter(count);
        } catch (error) {
            Alert.alert(`Error fetching data from :`, error.toString ? error.toString() : 'Unknown error');
            setError(error.response ? error.response.data.message : 'Error fetching data');
        }
    };

    const loadData = () => {
        if (userId) {
            setLoading(true);
            fetchData(`http://192.168.1.24:8000/api/get_voter_list_by_town_user/${userId}`, setTotalVoters, setFinalTotalVoters);
            fetchData(`http://192.168.1.24:8000/api/get_booth_names_by_town_user/${userId}`, setTotalBoothsCount, setFinalTotalBoothsCount);
            fetchData(`http://192.168.1.24:8000/api/town_user_id/${userId}/confirmation/1/`, setTotalVoted, setFinalTotalVoted);
            fetchData(`http://192.168.1.24:8000/api/town_user_id/${userId}/confirmation/2/`, setTotalNonVoted, setFinalTotalNonVoted);
            fetchData(`http://192.168.1.24:8000/api/get_booth_users_by_town_user/${userId}/`, setTotalUsers, setFinalTotalUsers);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [userId]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
        setRefreshing(false);
    };

    const animateCount = (finalCount, setter) => {
        const duration = 2000;
        const intervalTime = 50;
        const increments = Math.ceil(duration / intervalTime);
        const incrementValue = Math.ceil(finalCount / increments);

        const interval = setInterval(() => {
            setter(prev => {
                if (prev + incrementValue >= finalCount) {
                    clearInterval(interval);
                    return finalCount;
                }
                return prev + incrementValue;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    };

    useEffect(() => {
        animateCount(finalTotalVoters, setTotalVoters);
    }, [finalTotalVoters]);

    useEffect(() => {
        animateCount(finalTotalVoted, setTotalVoted);
    }, [finalTotalVoted]);

    useEffect(() => {
        animateCount(finalTotalNonVoted, setTotalNonVoted);
    }, [finalTotalNonVoted]);

    useEffect(() => {
        animateCount(finalTotalBoothsCount, setTotalBoothsCount);
    }, [finalTotalBoothsCount]);

    useEffect(() => {
        animateCount(finalTotalUsers, setTotalUsers);
    }, [finalTotalUsers]);

    const handlePress = (destination) => {
        navigation.navigate(destination);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.infoContainer}>
                    <Text style={styles.constituencyText}>
                        {language === 'en' ? 'Washim Constituency' : 'वाशिम मतदारसंघ'}
                    </Text>
                    <Text style={styles.userIdText}>
                        {language === 'en' ? 'User Id: ' : 'वापरकर्ता आयडी: '} : {userId}
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

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>
                        {language === 'en' ? 'Washim Constituency' : 'वशिम मतदारसंघ'}
                    </Text>
                    <View style={styles.gradientContainer}>
                        <Pressable onPress={() => handlePress('Voters List')}>
                            <LinearGradient
                                colors={['#3C4CAC', '#F04393']}
                                locations={[0.3, 1]}
                                style={styles.gradient}
                            >
                                <Text style={styles.gradientText}>{language === 'en' ? 'Total Voters' : 'एकूण मतदार'}</Text>
                                <Text style={styles.gradientText}>{totalVoters}</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <Pressable onPress={() => handlePress('Total Booths')} style={[styles.statsBox, styles.statsBoxBlue]}>
                            <Text style={styles.statsLabel}>{language === 'en' ? 'Total Booths' : 'एकूण बूथ'}</Text>
                            <Text style={styles.statsValue}>{totalBoothsCount}</Text>
                        </Pressable>

                        <Pressable onPress={() => handlePress('Booth Users')} style={[styles.statsBox, styles.statsBoxGreen]}>
                            <Text style={styles.statsLabel}>{language === 'en' ? 'Total Users' : 'एकूण कार्यकर्ता'}</Text>
                            <Text style={styles.statsValue}>{totalUsers || '0'}</Text>
                        </Pressable>
                    </View>

                    <View style={styles.statsRow}>
                        <Pressable style={[styles.statsBox, styles.statsBoxYellow]} onPress={() => handlePress('Total Voted')}>
                            <Text style={styles.statsLabel}>{language === 'en' ? 'Total Voted' : 'एकूण मतदान'}</Text>
                            <Text style={styles.statsValue}>{totalVoted}</Text>
                        </Pressable>

                        <Pressable style={[styles.statsBox, styles.statsBoxCyan]} onPress={() => handlePress('Total Non Voted')}>
                            <Text style={styles.statsLabel}>{language === 'en' ? 'Total Non-Voted' : 'एकूण मतदान बाकी'}</Text>
                            <Text style={styles.statsValue}>{totalNonVoted}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.votingStatsContainer}>
                    <View style={styles.votingStatsBox}>
                        <TownVotingBarStats />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default TownDashboard;


const styles = StyleSheet.create({
    container: {
        height: height * 0.93,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    headerContainer: {
        width: "100%",
        justifyContent: 'center',
    },
    constituencyText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3C4CAC',
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
        height: height * 0.38,
    },
    votingStatsBox: {
        flex: 1,
        borderWidth: 0.1,
        borderRadius: 1,
        marginHorizontal: '1%',
        paddingVertical: "2%",
    },
});
