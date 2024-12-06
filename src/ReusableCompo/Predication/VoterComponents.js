import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const VoterComponents = ({ children, voterType, voterCount, boxColor }) => {
    return (
        <View style={styles.container}>
            {/* Icon Container */}
            <View style={[styles.iconContainer, { backgroundColor: boxColor }]}>
                {children}
            </View>

            {/* Voter Details */}
            <View style={styles.detailsContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.voterType}>{voterType}</Text>
                    <Text style={styles.date}>August 27, 2024</Text>
                </View>

                {/* Voter Count */}
                <View style={styles.countContainer}>
                    <Text style={styles.voterCount}>{voterCount}</Text>
                </View>
            </View>
        </View>
    );
};

export default VoterComponents;

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        flexDirection: 'row',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        borderRadius: 5,
    },
    detailsContainer: {
        flexDirection: 'row',
        columnGap: 60,
        flex: 1,
        paddingHorizontal: 10,
    },
    textContainer: {
        justifyContent: 'space-around',
        flex: 1,
    },
    voterType: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        color: '#9095A1',
    },
    countContainer: {
        justifyContent: 'center',
    },
    voterCount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
