import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Dimensions, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { MaterialIcons, FontAwesome, AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { height, width } = Dimensions.get('window');

export default function Prediction() {
    const { language } = useContext(LanguageContext);
    const navigation = useNavigation();
    const [voterCounts, setVoterCounts] = useState({ total: 0, ours: 0, against: 0, doubted: 0, pending: 0, pink: 0, purple: 0, pro: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { buserId } = useContext(BoothUserContext);

    // const buserId = 123; // Replace with your actual buserId

    const fetchVoterData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://192.168.1.38:8000/api/get_voters_by_user_wise/${buserId}/`);

            const voters = response.data.voters || [];
            const totalVoters = voters.length;
            const ours = voters.filter(voter => voter.voter_favour_id === 1).length;
            const against = voters.filter(voter => voter.voter_favour_id === 2).length;
            const pink = voters.filter(voter => voter.voter_favour_id === 6 || voter.voter_favour_id === 5).length;
            const purple = voters.filter(voter => voter.voter_favour_id === 7).length;
            const doubted = voters.filter(voter => voter.voter_favour_id === 3).length;
            const pro = voters.filter(voter => voter.voter_favour_id === 4).length;
            const pending = totalVoters - (ours + against + doubted + pro + pink + purple);

            setVoterCounts({
                total: totalVoters,
                ours: ours,
                against: against,
                doubted: doubted,
                pending: pending,
                pink: pink,
                purple: purple,
                pro: pro,
            });
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (buserId) {
            fetchVoterData();
        }
    }, [buserId]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleNavigation = (relationId, ScreenName) => {
        navigation.navigate('Relational Voters', {
            relationId: relationId,
            ScreenName: ScreenName
        })
    };

    // Add a state for handling pull-to-refresh
    const [refreshing, setRefreshing] = useState(false);

    // Function to handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchVoterData().finally(() => setRefreshing(false));  // Reload data
    };

    const VoterBox = ({ boxColor, voterType, voterCount, icon, relationId, ScreenName }) => (
        <TouchableOpacity style={styles.voterBox}
            onPress={() => handleNavigation(relationId, ScreenName)}>
            <View style={[styles.iconContainer, { backgroundColor: boxColor }]}>
                {icon}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.voterType}>{voterType}</Text>
                <Text style={styles.voterCount}>{voterCount}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold', fontSize: 15 }}>Loading...</Text>
            </View>
        );
    }

    const predictionPercentage = ((voterCounts.ours + voterCounts.pro / voterCounts.total) * 100).toFixed(2);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={{ flex: 1, backgroundColor: 'white', paddingVertical: 10 }}>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <View style={styles.voterComponentsContainer}>
                        <TouchableOpacity style={styles.voterBox}
                            onPress={() => navigation.navigate('Total Voters')}>
                            <View style={[styles.iconContainer, { backgroundColor: '#DEDEDE' }]}>
                                {<AntDesign name="team" size={height * 0.035} color="grey" />}
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.voterType}>{language === 'en' ? 'Total Voters' : 'एकूण मतदार'}</Text>
                                <Text style={styles.voterCount}>{voterCounts.total.toString()}</Text>
                            </View>
                        </TouchableOpacity>

                        <VoterBox
                            boxColor={'#D9F4E9'}
                            voterType={language === 'en' ? 'Favourable Voters' : 'समर्थक मतदार'}
                            voterCount={voterCounts.ours.toString()}
                            relationId={'1'}
                            ScreenName={language === 'en' ? 'Favours Voters' : 'समर्थक मतदार'}
                            icon={<AntDesign name="heart" size={height * 0.035} color="green" />}
                        />
                        <VoterBox
                            boxColor={'#FDDDDD'}
                            voterType={language === 'en' ? 'Opposition Voters' : 'विरोधी मतदार'}
                            voterCount={voterCounts.against.toString()}
                            relationId={'2'}
                            ScreenName={language === 'en' ? 'Opposition Voters' : 'विरोधी मतदार'}
                            icon={<Entypo name="cross" size={height * 0.035} color="red" />}
                        />
                        <VoterBox
                            boxColor={'#fcf5cf'}
                            voterType={language === 'en' ? 'Doubted Voters' : 'संशयित मतदार'}
                            voterCount={voterCounts.doubted.toString()}
                            relationId={'3'}
                            ScreenName={language === 'en' ? 'Doubted Voters' : 'संशयित मतदार'}
                            icon={<AntDesign name="exclamationcircle" size={height * 0.035} color="orange" />}
                        />
                        <VoterBox
                            boxColor={'#e0e1ff'}
                            voterType={language === 'en' ? 'Pro+ Voters' : 'प्रो+ मतदार'}
                            voterCount={voterCounts.pro.toString()}
                            relationId={'4'}
                            ScreenName={language === 'en' ? 'Pro+ Voters' : 'प्रो+ मतदार'}
                            icon={<FontAwesome6 name="sack-dollar" size={height * 0.035} color="blue" />}
                        />
                        <VoterBox
                            boxColor={'#ECEEF7'}
                            voterType={language === 'en' ? 'Pending Voters' : 'बाकी मतदार'}
                            voterCount={voterCounts.pending.toString()}
                            relationId={'0'}
                            ScreenName={language === 'en' ? 'Pending Voters' : 'बाकी मतदार'}
                            icon={<MaterialIcons name="pending-actions" size={height * 0.035} color="#c26dbc" />}
                        />


                    </View>
                )}

                <TouchableOpacity onPress={() => navigation.navigate('Exit Poll')}
                    style={{
                        paddingHorizontal: 20, marginTop: height * 0.035
                    }}
                >
                    <LinearGradient
                        colors={['#3C4CAC', '#F04393']}
                        start={{ x: 0.0, y: 0.0 }}
                        end={{ x: 0.0, y: 1.0 }}
                        style={styles.predictionBox}
                    >
                        <View style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>
                                {language === 'en' ? 'Prediction' : 'संभाव्यता'}
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    voterComponentsContainer: {
        paddingHorizontal: 20
    },
    voterBox: {
        height: height * 0.09,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#DEDEDE',
        elevation: 3
    },
    iconContainer: {
        marginRight: 20,
        padding: 10,
        borderRadius: 5,
    },
    textContainer: {
        flex: 1,
    },
    voterType: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    voterCount: {
        fontSize: 16,
        color: '#666',
    },
    predictionBox: {
        borderRadius: 5,
        padding: 2,
        marginTop: -25,
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
    },
});
