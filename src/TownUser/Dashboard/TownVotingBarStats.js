import axios from 'axios';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('screen');

const TownVotingBarStats = memo(() => {
    const { userId } = useContext(TownUserContext)
    const [totalVoters, setTotalVoters] = useState(100);
    const [favorable, setFavorable] = useState(0);
    const [nonFavorable, setNonFavorable] = useState(0);
    const [doubted, setDoubted] = useState(0);
    const [nonVoted, setNonVoted] = useState(0);
    const { language } = useContext(LanguageContext);

    const perPercent = totalVoters > 0 ? totalVoters / 100 : 1;

    const data = React.useMemo(() => [
        { label: 'Favorable', value: Math.round(favorable / perPercent) },
        { label: 'Non Favorable', value: Math.round(nonFavorable / perPercent) },
        { label: 'Doubted', value: Math.round(doubted / perPercent) },
        { label: 'Non Voted', value: Math.round(nonVoted / perPercent) },
    ], [favorable, nonFavorable, doubted, nonVoted, totalVoters]);

    const colorData = ['#34A853', '#EA4335', '#FBBC04', '#545454'];
    const animatedValues = data.map(() => useSharedValue(0));

    React.useEffect(() => {
        data.forEach((item, index) => {
            animatedValues[index].value = withTiming(item.value, { duration: 1000 });
        });
    }, [data, animatedValues]);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.38:8000/api/get_voter_list_by_town_user/${userId}/`);
            const voterList = response.data;

            let favorableCount = 0;
            let nonFavorableCount = 0;
            let doubtedCount = 0;
            let nonVotedCount = 0;

            voterList.forEach((voter) => {
                switch (voter.voter_favour_id) {
                    case 1:
                    case 4:
                    case 5:
                        favorableCount++;
                        break;
                    case 2:
                        nonFavorableCount++;
                        break;
                    case 3:
                        doubtedCount++;
                        break;
                    case 0:
                    case null:
                        nonVotedCount++;
                        break;
                    default:
                        break;
                }
            });

            setTotalVoters(voterList.length);
            setFavorable(favorableCount);
            setNonFavorable(nonFavorableCount);
            setDoubted(doubtedCount);
            setNonVoted(nonVotedCount);
        } catch (error) {
            Alert.alert('Error fetching voter data:', error.toString ? error.toString() : 'Unknown error');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.barGraphContainer}>
                <Text style={styles.graphTitle}>{language === 'en' ? 'Voting Statistics' : 'मतदानाची आकडेवारी'}</Text>
                <View style={styles.barChart}>
                    {data.map((item, index) => {
                        const animatedStyle = useAnimatedStyle(() => ({
                            height: animatedValues[index].value * 1.8,
                            backgroundColor: colorData[index],
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
});

export default TownVotingBarStats;

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
