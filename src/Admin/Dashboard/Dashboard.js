import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import { LanguageContext } from '../../LanguageContext';
import WashimVoterContext from '../Context_Api/WashimVoterContext';

const { height, width } = Dimensions.get('screen');

const Dashboard = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);
    const { washimVoters, setWashimVoters, wshmVtrCount, setWshmVtrCount } = useContext(WashimVoterContext);
    const navigation = useNavigation();
    const [votersCounter, setVoterCounter] = useState({
        TotalVoters: null,
        Favorable: null,
        Non_Favorable: null,
        Doubted: null,
        Non_Voted: null
    });
    const [totalVoters, setTotalVoters] = useState('00000');
    const [totalTowns, setTotalTowns] = useState('000');
    const [totalBooths, setTotalBooths] = useState('000');
    const [totalVoted, setTotalVoted] = useState('000');
    const [totalNVoted, setNTotalVoted] = useState('000');
    const [refreshing, setRefreshing] = useState(false);

    const getVotersByUserwise = async () => {
        try {
            const result1 = await axios.get(`http://4.172.246.116:8000/api/voter_favour_counts/`);
            setVoterCounter({
                TotalVoters: result1.data.Total_Voters,
                Favorable: result1.data.Favourable,
                Non_Favorable: result1.data.Non_Favourable,
                Doubted: result1.data.Not_Confirmed,
                Non_Voted: result1.data.Pending
            });
        } catch (error) {
            console.error(error);
        }
    };

    const getVotedAndNonVotedCount = async () => {
        try {
            const response = await axios.get('http://4.172.246.116:8000/api/get_voted_and_non_voted_count/');
            setTotalVoted(response.data.voted_count.toString());
            setNTotalVoted(response.data.non_voted_count.toString());
        } catch (error) {
            console.error('Error fetching voted and non-voted count:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([getVotersByUserwise(), getVotedAndNonVotedCount()]);
        } catch (error) {
            console.error('Error during refresh:', error);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        if (washimVoters.length > 0) {
            setTotalVoters(washimVoters.length);
        } else {
            axios.get('http://4.172.246.116:8000/api/voter_count')
                .then(response => {
                    console.log(response.data.length);
                    setTotalVoters(response.data.length);
                    setWashimVoters(response.data);
                })
                .catch(error => {
                    console.error('Error fetching total voters count:', error);
                });
        }
        axios.get('http://4.172.246.116:8000/api/towns/')
            .then(response => {
                setTotalTowns(response.data.length.toString());
            })
            .catch(error => {
                console.error('Error fetching total towns:', error);
            });

        axios.get('http://4.172.246.116:8000/api/booths/')
            .then(response => {
                setTotalBooths(response.data.length.toString());
            })
            .catch(error => {
                console.error('Error fetching total booths count:', error);
            });

        getVotedAndNonVotedCount();
    }, []);

    useEffect(() => {
        getVotersByUserwise();
    }, []);



    return (
        <HeaderFooterLayout showHeader={false} showFooter={true}>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>
                        {language === 'en' ? 'Washim Nagar Parishad' : 'वाशिम नगरपरिषद'}
                    </Text>
                    <Pressable onPress={() => { navigation.navigate('Total Voters') }} style={{
                        height: height * 0.1,
                        borderRadius: 10,
                        // paddingVertical: '5%',
                        width: '100%',
                    }}>
                        <LinearGradient
                            colors={['#3C4CAC', '#F04393']}
                            locations={[0.3, 1]}
                            style={styles.gradient}
                        >
                            <Text style={styles.gradientText}>
                                {language === 'en' ? 'Total Voters Count' : 'एकूण मतदार संख्या'}
                            </Text>
                            <Text style={styles.gradientText}>{totalVoters}</Text>
                        </LinearGradient>
                    </Pressable>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <Pressable onPress={() => { navigation.navigate('Towns') }} style={[styles.statsBox, styles.statsBoxBlue]}>
                            <Text style={styles.statsLabel}>{language === 'en' ? 'Total Towns' : 'एकूण गांव / शहरे'}</Text>
                            <Text style={styles.statsValue}>{totalTowns}</Text>
                        </Pressable>

                        <Pressable onPress={() => { navigation.navigate('Booths'); }} style={[styles.statsBox, styles.statsBoxGreen]}>
                            <Text style={styles.statsLabel}>{language === 'en' ? 'Total Booths' : 'एकूण बूथ'}</Text>
                            <Text style={styles.statsValue}>{totalBooths}</Text>
                        </Pressable>
                    </View>

                    <View style={styles.statsRow}>
                        <Pressable style={[styles.statsBox, styles.statsBoxYellow]} onPress={() => { navigation.navigate('Voted') }}>
                            <Text style={styles.statsLabel}>{language === 'en' ? 'Total Voted' : 'एकूण मतदान झाले'}</Text>
                            <Text style={styles.statsValue}>{totalVoted}</Text>
                        </Pressable>

                        <Pressable style={[styles.statsBox, styles.statsBoxCyan]} onPress={() => { navigation.navigate('Nvoted') }}>
                            <Text style={styles.statsLabel}>{language === 'en' ? 'Total Non-Voted' : 'एकूण मतदान नाही'}</Text>
                            <Text style={styles.statsValue}>{totalNVoted}</Text>
                        </Pressable>
                    </View>
                </View>

            </ScrollView>
        </HeaderFooterLayout>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        // marginBottom: height * 0.05,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    headerContainer: {
        height: height * 0.2,
        width: "100%",
        justifyContent: 'center',
        // backgroundColor: 'green',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#3C4CAC',
        // backgroundColor: 'yellow',
    },
    gradient: {
        height: '100%',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    gradientText: {
        fontSize: width * 0.05,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
    },
    statsContainer: {
        height: height * 0.6,
        paddingVertical: "3%",
        // backgroundColor:'red'
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: height * 0.18,
        marginVertical: "3%",
        columnGap: 15
    },
    statsBox: {
        flex: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3
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
        fontSize: 20,
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
        paddingVertical: "2%"
    },
});
