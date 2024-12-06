import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Octicons, MaterialIcons, FontAwesome6 } from 'react-native-vector-icons/';



const TopNavCompo = ({ navigation, ScreenName, colorName }) => {
    const handleGoBack = () => {
        navigation.goBack();
    };



    return (
        <View style={styles.nav}>
            <Pressable onPress={handleGoBack}>
                <MaterialIcons name="keyboard-backspace" size={30} color="white" />
            </Pressable>

            <Text style={[styles.text, { color: colorName ? colorName : 'black' }]}>{ScreenName}</Text>

            <Pressable onPress={() => navigation.navigate('ContactUs')}>
                <FontAwesome6 name="phone" size={20} color={colorName ? colorName : 'black'} />
            </Pressable>
        </View>
    )
}

export default TopNavCompo;


const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})