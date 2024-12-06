import React, { useEffect, useRef, useState, useContext } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { BoothUserContext } from '../../ContextApi/BuserContext';


const { height } = Dimensions.get('screen');
export default function ResponsivePoll() {
    const { buserId } = useContext(BoothUserContext);
    const { language } = useContext(LanguageContext);
    const [voterCounts, setVoterCounts] = useState({ Total: 0, Favorable: 0, Non_Favorable: 0, Doubted: 0 });

    const totalVoterHeight = useRef(new Animated.Value(0)).current;
    const favorableHeight = useRef(new Animated.Value(0)).current;
    const nonFavorableHeight = useRef(new Animated.Value(0)).current;
    const doubtedHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchVoterData();
    }, [buserId]);

    const fetchVoterData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.24:8000/api/get_voters_by_user_wise/${buserId}/`);
            const voters = response.data.voters;

            const counts = {
                Total: voters.length,
                Favorable: voters.filter(voter => voter.voter_favour_id === 1 || voter.voter_favour_id === 4).length,
                Non_Favorable: voters.filter(voter => voter.voter_favour_id === 2).length,
                Doubted: voters.filter(voter => voter.voter_favour_id === 3).length,
            };

            setVoterCounts(counts);

            const perPercent = counts.Total ? counts.Total / 100 : 1;
            animateBar(totalVoterHeight, counts.Total / perPercent);
            animateBar(favorableHeight, counts.Favorable / perPercent);
            animateBar(nonFavorableHeight, counts.Non_Favorable / perPercent);
            animateBar(doubtedHeight, counts.Doubted / perPercent);
        } catch (error) {
            console.error("Error fetching voter data:", error.toString ? error.toString() : 'Unknown error');
        }
    };

    const animateBar = (barRef, value) => {
        Animated.timing(barRef, {
            toValue: value * 2,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>
                {language === 'en' ? 'Votes Distribution' : 'मते विश्लेषण'}
            </Text>
            <View style={styles.barChart}>
                <View style={styles.barItem}>
                    <Animated.View style={[styles.bar, { height: totalVoterHeight }]} />
                    <Text style={styles.barLabel}>{voterCounts.Total > 0 ? `${((voterCounts.Total / voterCounts.Total).toFixed(5) * 100)}%` : " 0%"}</Text>
                </View>
                <View style={styles.barItem}>
                    <Animated.View style={[styles.bar, { height: favorableHeight }]} />
                    <Text style={styles.barLabel}>{voterCounts.Favorable > 0 ? `${((voterCounts.Favorable / voterCounts.Total).toFixed(5) * 100)}%` : "0 %"}</Text>
                </View>
                <View style={styles.barItem}>
                    <Animated.View style={[styles.bar, { height: nonFavorableHeight }]} />
                    <Text style={styles.barLabel}>{voterCounts.Non_Favorable > 0 ? `${((voterCounts.Non_Favorable / voterCounts.Total).toFixed(5) * 100)}%` : "0 %"}</Text>
                </View>
                <View style={styles.barItem}>
                    <Animated.View style={[styles.bar, { height: doubtedHeight }]} />
                    <Text style={styles.barLabel}>{voterCounts.Doubted > 0 ? `${((voterCounts.Doubted / voterCounts.Total).toFixed(5) * 100)}%` : "0 %"}</Text>
                </View>
            </View>
            <View style={styles.barLabels}>
                <Text style={styles.barLabelText}>{language === 'en' ? 'Total Voters' : 'एकूण मतदार'}</Text>
                <Text style={styles.barLabelText}>{language === 'en' ? 'Favorable' : 'समर्थक'}</Text>
                <Text style={styles.barLabelText}>{language === 'en' ? 'Against' : 'विरुद्ध'}</Text>
                <Text style={styles.barLabelText}>{language === 'en' ? 'Doubted' : 'संशयित'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // marginRight: '8%',
    },
    graphTitle: {
        fontSize: height * 0.03,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    barChart: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 200,
        marginVertical: 20,
        position: 'relative',
        marginTop: 25,
    },
    barItem: {
        alignItems: 'center',
    },
    bar: {
        width: 50,
        backgroundColor: '#4069E5',
    },
    barLabel: {
        marginTop: 5,
        color: '#000',
        fontWeight: 'bold',
    },
    barLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    barLabelText: {
        textAlign: 'center',
        color: '#6E7787',
        fontSize: 14,
    },
});
