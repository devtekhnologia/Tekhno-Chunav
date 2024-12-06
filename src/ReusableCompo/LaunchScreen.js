import React, { useEffect, useRef } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, View, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const LaunchScreen = () => {
    const navigation = useNavigation();
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > 30 || Math.abs(gestureState.dy) > 30; // Threshold for swiping
            },
            onPanResponderEnd: (evt, gestureState) => {
                // Determine swipe direction
                if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
                    // Horizontal swipe
                    navigation.navigate('ProfileChooser');
                } else {
                    // Vertical swipe
                    navigation.navigate('ProfileChooser');
                }
            },
        })
    ).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('ProfileChooser');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <LinearGradient
            colors={['#3C4CAC', '#F04393']}
            locations={[0.65, 1]}
            style={styles.linearGradient}
        >
            <View style={styles.imageContainer} {...panResponder.panHandlers}>
                <ImageBackground
                    source={require('../../assets/Cover.png')}
                    style={styles.backgroundImage}
                >
                    <View style={styles.container}>
                        <Image
                            source={require('../../assets/tekhnoblue.png')}
                            style={{ width: width * 0.6, height: width * 0.6 }}
                        />
                        <Text style={styles.text}>Your gateway to get vote prediction</Text>
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.smallLogoView}>
                <Image
                    source={require('../../assets/tempLogo.png')}
                    style={{ width: width * 0.2, height: width * 0.2, alignSelf: 'center', marginVertical: width * 0.04 }}
                />
            </View>
        </LinearGradient>
    );
}

export default LaunchScreen;

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: '65%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    backgroundImage: {
        width: width * 1.1,
        height: height * 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
        marginTop: -height * 0.35,
        marginLeft: -width * 0.05
    },
    container: {
        width: width * 2,
        height: height * 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottomLeftRadius: height * 1,
        borderBottomRightRadius: height * 1,
        paddingTop: "50%"
    },
    text: {
        color: '#0A2E73',
        fontSize: height * 0.022,
        fontWeight: 'bold',
    },
    smallLogoView: {
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: (width * 0.3) / 2,
        backgroundColor: 'white',
        left: width * 0.35,
        top: height * 0.57,
        borderWidth: 3,
        borderColor: '#3C4CAC',
    }
});
