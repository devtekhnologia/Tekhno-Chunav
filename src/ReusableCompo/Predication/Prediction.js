import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import VoterComponents from './VoterComponents';
import TopNavCompo from '../../ReusableCompo/TopNavCompo';
import axios from 'axios';
import { AuthenticationContext } from '../../Admin/Context_Api/AuthenticationContext';

const Prediction = () => {
    const navigation = useNavigation();
    const { userId } = useContext(AuthenticationContext)
    const [votersCounter, setVoterCounter] = useState({
        TotalVoters: null,
        Favorable: null,
        Non_Favorable: null,
        Doubted: null,
        Non_Voted: null
    });

    const getVotersByUserwise = async () => {
        try {
            const result = await axios.get(`http://192.168.1.24:8000/api/get_voters_by_user_wise/${userId}/`);
            const totalVoterDetails = result.data.voters;

            const totalVoterCount = totalVoterDetails.length;
            const favorableCount = totalVoterDetails.filter(voter => voter.voter_favour_id === 1).length;
            const non_FavorableCount = totalVoterDetails.filter(voter => voter.voter_favour_id === 2).length;
            const doubtedCount = totalVoterDetails.filter(voter => voter.voter_favour_id === 3).length;
            const pendingCount = totalVoterDetails.filter(voter => (voter.voter_favour_id !== 1 && voter.voter_favour_id !== 2 && voter.voter_favour_id !== 3)).length;

            setVoterCounter({
                TotalVoters: totalVoterCount,
                Favorable: favorableCount,
                Non_Favorable: non_FavorableCount,
                Doubted: doubtedCount,
                Non_Voted: pendingCount
            });
        } catch (error) {
            Alert.alert("Failed to fetch data", error.toString ? error.toString() : 'Unknown error');
        }
    };

    useEffect(() => {
        if (userId) {
            getVotersByUserwise();
        }
    }, [userId]);


    return (
        <View style={{ paddingHorizontal: 20, paddingVertical: 50 }}>
            <StatusBar style='auto' />
            <TopNavCompo navigation={navigation} ScreenName={"Prediction"} />

            <View style={{ marginVertical: 30 }}>
                <VoterComponents boxColor={'#DEDEDE'} voterType={'Total Voters'} voterCount={votersCounter.TotalVoters || '000'}>
                    <AntDesign name="team" size={30} color="grey" />
                </VoterComponents>
                <VoterComponents boxColor={'#D9F4E9'} voterType={'Favourable Voters'} voterCount={votersCounter.Favorable || '000'} >
                    <AntDesign name="heart" size={30} color="green" />
                </VoterComponents>
                <VoterComponents boxColor={'#FDDDDD'} voterType={'Opposition Voters'} voterCount={votersCounter.Non_Favorable || '000'}>
                    <Entypo name="cross" size={40} color="red" />
                </VoterComponents>

                <VoterComponents boxColor={'#FFFAE1'} voterType={'Doubted Voters'} voterCount={votersCounter.Doubted || '000'} >
                    {/* <Fontisto name="confused" size={24} color="orange" /> */}
                    <AntDesign name="exclamationcircle" size={30} color="orange" />
                </VoterComponents>
                <VoterComponents boxColor={'#ECEEF7'} voterType={'Pending'} voterCount={votersCounter.Non_Voted || '000'} >
                    <MaterialIcons name="pending-actions" size={30} color="#c26dbc" />
                </VoterComponents>
            </View>

            <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                start={{ x: 0.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
                style={styles.box}
            >
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>
                        Prediction 78%
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

export default Prediction;

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        borderRadius: 5,
        padding: 2,
        // marginVertical: 25
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 3,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        padding: 15,
    }


});
