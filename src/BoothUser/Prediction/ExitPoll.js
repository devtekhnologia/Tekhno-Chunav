import { Alert, Dimensions, LogBox, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import ResponsivePoll from '../Prediction/ResponsivePoll';
import ProgressCircleWithMargin from '../Prediction/ProgressCircleWithMargin';
import axios from 'axios';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import { LanguageContext } from '../../ContextApi/LanguageContext';


const { height, width } = Dimensions.get('window');

export default function ExitPoll() {
    const navigation = useNavigation();
    const { language } = useContext(LanguageContext);
    const { buserId } = useContext(BoothUserContext);
    const [votersCounter, setVoterCounter] = useState({
        TotalVoters: null,
        Favorable: null,
        Non_Favorable: null,
        Doubted: null,
    });
    const [refreshing, setRefreshing] = useState(false);

    const [supportVotedPercentage, setSupportVotedPercentage] = useState(0);
    const [supportNonVotedPercentage, setSupportNonVotedPercentage] = useState(0);
    console.log(supportNonVotedPercentage, supportVotedPercentage);


    const getFevourVotedPercentage = async () => {
        try {
            if (!votersCounter || votersCounter.TotalVoters === 0) {
                Alert.alert("Invalid data", "Total Voters count is zero or undefined.");
                return;
            }

            // First API request for Support Voted Percentage
            const result = await axios.get(`http://192.168.1.24:8000/api/get_voter_info_by_booth_user/user_booth_user_id/${buserId}/voter_favour_id/1/voter_vote_confirmation_id/1/`);

            if (result && result.data && Array.isArray(result.data)) {
                const supportVotedPercentage = (result.data.length / votersCounter.TotalVoters);
                setSupportVotedPercentage(Number(supportVotedPercentage)); // Ensure it's a number
            } else {
                console.warn("Unexpected response structure for Support Voted Percentage:", result);
                Alert.alert("Data Error", "Failed to load Support Voted Percentage data.");
                return;
            }

            // Second API request for Non-Support Voted Percentage
            const result2 = await axios.get(`http://192.168.1.24:8000/api/get_voter_info_by_booth_user/user_booth_user_id/${buserId}/voter_favour_id/1/voter_vote_confirmation_id/2/`);

            if (result2 && result2.data && Array.isArray(result2.data)) {
                const supportNonVotedPercentage = (result2.data.length / votersCounter.TotalVoters);
                setSupportNonVotedPercentage(Number(supportNonVotedPercentage)); // Ensure it's a number
            } else {
                console.warn("Unexpected response structure for Non-Support Voted Percentage:", result2);
                Alert.alert("Data Error", "Failed to load Non-Support Voted Percentage data.");
                return;
            }

        } catch (error) {
            console.error("Error fetching data: ", error);
            const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
            Alert.alert("Failed to fetch data", errorMessage);
        }
    };




    const getVotersByUserwise = async () => {
        try {
            const result = await axios.get(`http://192.168.1.24:8000/api/get_voters_by_user_wise/${buserId}/`);
            const totalVoterDetails = result.data.voters;

            const totalVoterCount = totalVoterDetails.length;
            const favorableCount = totalVoterDetails.filter(voter => voter.voter_favour_id === 1).length;
            const non_Favorable = totalVoterDetails.filter(voter => voter.voter_favour_id === 2).length;
            const Doubted = totalVoterDetails.filter(voter => voter.voter_favour_id === 3).length;

            setVoterCounter({
                TotalVoters: totalVoterCount,
                Favorable: favorableCount,
                Non_Favorable: non_Favorable,
                Doubted: Doubted,
            });
        } catch (error) {
            Alert.alert("Failed to fetch data ", error.toString ? error.toString() : 'Unknown error');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (buserId) {
            await getVotersByUserwise();
            await getFevourVotedPercentage();
        }
        setRefreshing(false);
    };


    useEffect(() => {
        if (buserId) {
            getVotersByUserwise();
        }
    }, [buserId]);

    useEffect(() => {
        if (votersCounter.TotalVoters !== null) {
            getFevourVotedPercentage()
        }
    }, [votersCounter]);

    return (
        <ScrollView style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            scrollEnabled={false}
        >
            <View style={styles.graphContainer}>
                <ResponsivePoll
                    TotalVoters={votersCounter.TotalVoters}
                    Favorable={votersCounter.Favorable}
                    Non_Favorable={votersCounter.Non_Favorable}
                    Doubted={votersCounter.Doubted}
                />
            </View>

            {/* {supportVotedPercentage !== 0 && supportNonVotedPercentage !== 0 && */}
            <View style={styles.statisticsContainer}>
                <Text style={styles.statisticsTitle}>{language === 'en' ? 'Statistics' : 'सांख्यिकी'}</Text>
                <View style={styles.progressContainer}>
                    <View style={styles.progressItem}>
                        <Text style={styles.progressLabel}>{language === 'en' ? 'Support Voted' : 'समर्थित मत दिले'}</Text>
                        <ProgressCircleWithMargin
                            progressValue={supportVotedPercentage}
                            circleProgessColor={'#00BDD6'}
                            unfilledColor={'#A6F5FF'}
                        />
                    </View>
                    <View style={styles.progressItem}>
                        <Text style={[styles.progressLabel, { color: '#8353E2' }]}>{language === 'en' ? 'Support Not Voted' : 'समर्थित मत दिले नाही'}</Text>
                        <ProgressCircleWithMargin
                            progressValue={supportNonVotedPercentage}
                            circleProgessColor={'#8353E2'}
                            unfilledColor={'#D9CBF6'}
                        />
                    </View>
                </View>
            </View>
            {/* } */}
        </ScrollView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 10,
        // justifyContent: 'flex-start',
        backgroundColor: 'white'
    },
    graphContainer: {
        flex: 0.55,
        marginBottom: 30,
        // backgroundColor: 'red'

    },
    statisticsContainer: {
        flex: 0.45,
        // backgroundColor: 'red'
    },
    statisticsTitle: {
        fontSize: height * 0.0255,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    progressItem: {
        // marginBottom: 20,
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    progressLabel: {
        marginTop: 15,
        fontSize: height * 0.02,
        fontWeight: 'bold',
        color: '#00BDD6',
    },
    progressLabell: {
        marginTop: 5,
        fontSize: height * 0.02,
        fontWeight: 'bold',
        color: '#8353E2',
    },
});
