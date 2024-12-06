import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../ContextApi/LanguageContext';



const voterNameList = [
    { id: '1', fullname: "Arnav Anil Bhagat", Voter_Favourable_Name: 'Favourable', cast: 'Brahmin', Voter_Favourable_Id: '1' },
    { id: '8', fullname: "Anil Parabh", Voter_Favourable_Name: 'Doubted', cast: 'Brahmin', Voter_Favourable_Id: '3' },
    { id: '9', fullname: "Vijay Desai", Voter_Favourable_Name: 'Pending', cast: 'Brahmin', Voter_Favourable_Id: '4' },
    { id: '10', fullname: "Sandesh Haral", Voter_Favourable_Name: 'Non-Favourable', cast: 'Brahmin', Voter_Favourable_Id: '2' },
    { id: '11', fullname: "Dipak Chaudhari", Voter_Favourable_Name: 'Favourable', cast: 'Brahmin', Voter_Favourable_Id: '1' },
    { id: '2', fullname: "Mayur", Voter_Favourable_Name: 'Non-Favourable', cast: 'Maratha', Voter_Favourable_Id: '2' },
    { id: '3', fullname: "Raghav Bhagat", Voter_Favourable_Name: 'Doubted', cast: 'Mali', Voter_Favourable_Id: '3' },
    { id: '4', fullname: "Shubham tote", Voter_Favourable_Name: 'Pending', cast: 'Dhangar', Voter_Favourable_Id: '4' },
    { id: '5', fullname: "Sujit Auti", Voter_Favourable_Name: 'Favourable', cast: 'Buddhist', Voter_Favourable_Id: '5' },
    { id: '6', fullname: "Rohit Linge", Voter_Favourable_Name: 'Chocolate', cast: 'Jain', Voter_Favourable_Id: '6' },
    { id: '7', fullname: "Rahul Tonde", Voter_Favourable_Name: 'Golden', cast: 'Sindhi', Voter_Favourable_Id: '7' },
];


const FavorableRecords = () => {
    const navigation = useNavigation();
    const { language } = useContext(LanguageContext);

    const [searchedValue, setSearchValue] = useState(null)

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={{ padding: 20, }}>
            <StatusBar />
            <View style={styles.nav}>
                <Pressable onPress={handleGoBack}>
                    <Icon name='chevron-left' size={25} />
                </Pressable>

                <Text style={styles.text}>Favorable Records</Text>

                <Pressable onPress={() => { alert('select multiple..') }}
                    style={styles.blackCircle} />
            </View>

            <View style={{
                borderColor: '#9095A1', borderWidth: 1.5, borderRadius: 5, height: 45,
                flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, columnGap: 10
            }} >
                <Ionicons name="search" size={20} color="grey" />
                <TextInput
                    value={searchedValue}
                    onChangeText={text => { setSearchValue(text) }}
                    placeholder={language === 'en' ? 'Search by voter’s name or ID' : 'मतदाराचे नाव किंवा ओळखपत्राने शोधा'}
                    style={{ flex: 1, padding: 5, }}
                />
            </View>

            <View>
                <FlatList
                    data={voterNameList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Pressable style={styles.voterItem}>
                            <View style={styles.voterDetails}>
                                <Text>{item.id}</Text>
                                <Text>{item.fullname}</Text>
                            </View>
                            <Pressable style={styles.blackCircle} />
                        </Pressable>
                    )
                    }
                />
            </View>
        </View>
    )
}

export default FavorableRecords

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 30
    },
    text: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    blackCircle: {
        width: 25,
        height: 25,
        backgroundColor: '#188357',
        borderRadius: 25,
    },
    voterItem: {
        flex: 1,
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1
    },
    voterDetails: {
        flexDirection: 'row',
        columnGap: 10
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: 'gray',
    },
})