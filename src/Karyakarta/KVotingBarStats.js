import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import axios from 'axios';
import { KaryakartaContext } from '../ContextApi/KaryakartaContext';
import { LanguageContext } from '../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('screen');

export default function KVotingBarStats() {
    const { KuserId } = useContext(KaryakartaContext);
    const { language } = useContext(LanguageContext);
    const [voterData, setVoterData] = useState([]);
    const [barData, setBarData] = useState({
        favorable: 0,
        nonFavorable: 0,
        doubted: 0,
        nonVoted: 0,
    });

    // Fetch data from API
    useEffect(() => {
        axios.get(`http://192.168.1.38:8000/api/voters_by_group_user/${KuserId}/`)
            .then((response) => {
                const voters = response.data.voters;
                const counts = { favorable: 0, nonFavorable: 0, doubted: 0, nonVoted: 0 };

                // Count the occurrences of each voter_favour_id
                voters.forEach(voter => {
                    switch (voter.voter_favour_id) {
                        case 1:
                        case 4:
                        case 5:
                            counts.favorable++;
                            break;
                        case 2:
                            counts.nonFavorable++;
                            break;
                        case 3:
                            counts.doubted++;
                            break;
                        case 0:
                            counts.nonVoted++;
                            break;
                        default:
                            break;
                    }
                });

                setBarData(counts);
            })
            .catch((error) => {
                console.error('Error fetching voter data:', error);
            });
    }, [KuserId]);

    const totalVoters = barData.favorable + barData.nonFavorable + barData.doubted + barData.nonVoted;
    const perPercent = totalVoters > 0 ? totalVoters / 100 : 1;

    const data = [
        { label: 'Favorable', value: Math.round(barData.favorable / perPercent) },
        { label: 'Non Favorable', value: Math.round(barData.nonFavorable / perPercent) },
        { label: 'Doubted', value: Math.round(barData.doubted / perPercent) },
        { label: 'Non Voted', value: Math.round(barData.nonVoted / perPercent) },
    ];

    const colorData = [
        { label: 'green', value: '#34A853' },
        { label: 'red', value: '#EA4335' },
        { label: 'yellow', value: '#FBBC04' },
        { label: 'black', value: '#545454' },
    ];

    // Initialize the animated values for each bar
    const animatedValues = data.map(() => useSharedValue(0));

    // Update animated values with a smooth transition
    useEffect(() => {
        data.forEach((item, index) => {
            animatedValues[index].value = withTiming(isNaN(item.value) ? 0 : item.value, { duration: 1000 });
        });
    }, [data]);

    return (
        <View style={styles.container}>
            <View style={styles.barGraphContainer}>
                <Text style={styles.graphTitle}>{language === 'en' ? 'Voting Statistics' : 'मतदानाची आकडेवारी'}</Text>
                <View style={styles.barChart}>
                    {data.map((item, index) => {
                        const animatedStyle = useAnimatedStyle(() => ({
                            height: animatedValues[index].value * 1.8,
                            backgroundColor: colorData[index]?.value, // Use value from colorData
                        }));

                        return (
                            <View key={index} style={styles.barContainer}>
                                <Text style={styles.barText}>{item.value}%</Text>
                                <Animated.View style={[styles.bar, animatedStyle]} />
                            </View>
                        );
                    })}
                </View>

                <View style={styles.legendContainer}>
                    <View style={styles.legendColumn}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#34A853' }]} />
                            <Text style={styles.legendLabel}>
                                {language === 'en' ? 'Favorable' : 'समर्थक'}
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#EA4335' }]} />
                            <Text style={styles.legendLabel}>
                                {language === 'en' ? 'Against' : 'विरोधी'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.legendColumn}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#FBBC04' }]} />
                            <Text style={styles.legendLabel}>
                                {language === 'en' ? 'Doubted' : 'अनिश्चित'}
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#545454' }]} />
                            <Text style={styles.legendLabel}>
                                {language === 'en' ? 'Pending' : 'बाकी'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    barGraphContainer: {
        width: '100%',
    },
    graphTitle: {
        fontSize: height * 0.018,
        fontWeight: '700',
        textAlign: 'center',
    },
    barChart: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: height * 0.27,
    },
    barContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    barText: {
        textAlign: 'center',
        fontSize: 10,
    },
    bar: {
        width: width * 0.1,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    legendColumn: {
        flexDirection: 'column',
        marginVertical: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        columnGap: 10
    },
    legendColor: {
        height: 10,
        width: 12,
        borderRadius: 10,
    },
    legendLabel: {
        fontSize: height * 0.014,
        color: 'black',
    },
});
