import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress'; // Import the entire Progress namespace


const { height, width } = Dimensions.get('screen')
export default function ProgressCircleWithMargin({ progressValue, circleProgessColor, unfilledColor }) {


    return (
        <View style={styles.container}>
            <View style={[styles.progressCircle, { borderColor: circleProgessColor }]}>
                <Progress.Circle
                    progress={progressValue.toFixed(2)}
                    size={width * 0.32}
                    borderWidth={0}
                    color={circleProgessColor}
                    thickness={width * 0.06}
                    unfilledColor={unfilledColor}
                    strokeCap={'butt'}
                />
                <Text style={[styles.text, { color: circleProgessColor }]}>{progressValue.toFixed(2)}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    progressCircle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 0.22,
        width: width * 0.42,
        marginVertical: '20%',
        marginHorizontal: '3%',
        // backgroundColor: 'grey',
    },
    text: {
        fontSize: height * 0.03,
        fontWeight: 'bold',
        position: 'absolute',
    },
});


