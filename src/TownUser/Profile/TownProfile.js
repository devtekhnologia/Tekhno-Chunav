import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import { TownUserContext } from '../../ContextApi/TownUserProvider';
import axios from 'axios';
import { err } from 'react-native-svg';
import { LanguageContext } from '../../ContextApi/LanguageContext';

const { width, height } = Dimensions.get('window');

const TownProfile = () => {
  const navigation = useNavigation();
  const { userId } = useContext(TownUserContext)
  const { language } = useContext(LanguageContext);

  const [TownUser, setTownUser] = useState({
    "UserId": null,
    "Name": null,
    "Contact": null,
    "Town": null
  })


  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNotificationBtn = () => {
    Alert.alert("Notification Pressed...");
  };

  const getTownUserInfo = async () => {
    try {
      const response = await axios.get(`http://192.168.1.24:8000/api/town_user_info/${userId}/`)

      setTownUser({
        "UserId": response.data[0].town_user_id,
        "Name": response.data[0].town_user_name,
        "Contact": response.data[0].town_user_contact_number,
        "Town": response.data[0].town_name_mar || response.data[0].town_names
      })

    } catch (error) {
      Alert.alert("Error for gettig town user info..", error.toString ? error.toString() : 'Unknown error');
    }
  }


  useEffect(() => {
    if (userId) {
      getTownUserInfo()
    }
  }, [userId])

  return (
    <>
      <View style={{ height: height * 0.3 }}>
        <LinearGradient
          colors={['#3C4CAC', '#F04393']}
          locations={[0.2, 1]}
          style={styles.gradient}
        >
          <View style={styles.nav}>
            <Pressable onPress={handleGoBack}>
              <Octicons name="chevron-left" size={30} color={'white'} />
            </Pressable>

            <Text style={[styles.text, { color: 'white' }]}>{language === 'en' ? 'Profile' : 'प्रोफाइल'}</Text>

            <Pressable onPress={handleNotificationBtn}>
              <AntDesign name="bells" size={25} color={'white'} />
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      <View style={{ height: height * 0.5, paddingHorizontal: height * 0.025 }}>
        <View style={styles.profileDetailsView}>
          <View style={styles.profileImageView}>
            <View style={styles.profileImageCircle}>
              <Image source={require('../../../assets/Cover.png')} style={styles.profileImage} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3C4CAC' }}>{TownUser.Name}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{language === 'en' ? 'Town User' : 'गाव/शहर कार्यकर्ता'}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <TextInput
              style={styles.profileTextInput}
              value={language === 'en' ? `User Name : ${TownUser.Name}` : `वापरकर्ता नाव : ${TownUser.Name}`}
              editable={false}
              placeholder='User Name'
              multiline={true}
            />
            <TextInput
              style={styles.profileTextInput}
              value={language === 'en' ? `User Id : ${TownUser.UserId}` : `आयडी : ${TownUser.UserId}`}
              editable={false}
              placeholder='User Id'
            />
            <TextInput
              style={styles.profileTextInput}
              value={language === 'en' ? `Contact No : ${TownUser.Contact}` : `फोन नंबर : ${TownUser.Contact}`}
              editable={false}
              placeholder='Contact No'
            />
            <TextInput
              style={styles.profileTextInput}
              value={language === 'en' ? `Town : ${TownUser.Town}` : `गाव/शहर : ${TownUser.Town}`}
              editable={false}
              placeholder={language === 'en' ? 'Town' : 'गाव/शहर'}
              multiline={true}
            />
          </View >
        </View>


        <View style={{ height: height * 0.1, marginTop: height * 0.01 }}>
          <Pressable style={styles.logOutButton} onPress={() => { navigation.navigate('LogOut') }}>
            <Text style={styles.logOutButtonTxt}>{language === 'en' ? 'Log Out' : 'लॉग आउट'}</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
    paddingTop: 45,
  },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    color: 'black',
    fontSize: height * 0.0255,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  profileDetailsView: {
    height: height * 0.55,
    width: "99%",
    elevation: 2,
    borderRadius: 10,
    marginTop: '-17%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  profileImageView: {
    width: '100%',
    borderBottomWidth: 1,
    borderBlockColor: 'black',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  },
  profileImageCircle: {
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: width,
    borderColor: '#3C4CAC',
    marginTop: -height * 0.1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  profileTextInput: {
    width: width * 0.8,
    height: height * 0.06,
    borderRadius: 8,
    paddingStart: 20,
    marginVertical: height * 0.017,
    backgroundColor: 'rgba(236, 238, 247, 1)',
    fontSize: 18,
  },
  logOutButton: {
    width: width * 0.8,
    height: height * 0.06,
    backgroundColor: '#F04393',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    borderRadius: 7,
    // padding: 10
  },
  logOutButtonTxt: {
    color: 'white',
    fontSize: height * 0.02,
    textAlign: 'center'
  }
});

export default TownProfile;
