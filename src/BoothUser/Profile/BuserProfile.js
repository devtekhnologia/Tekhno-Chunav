import { Alert, Dimensions, Image, View, StyleSheet, Text, TextInput, ActivityIndicator } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('screen');

const BuserProfile = () => {
  const { language } = useContext(LanguageContext);
  const { buserId } = useContext(BoothUserContext);

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNotificationBtn = () => {
    navigation.navigate('Contact Us');
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/booth_user_info/${buserId}/`);
      setUserInfo(response.data[0]);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user information');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const CustomeTextInput = ({ label, valueDetails, styles, readValue }) => (
    <TextInput value={label + valueDetails} style={styles} editable={!readValue} />
  );


  return (
    <>
      <View style={{ height: height * 0.25 }}>
        <LinearGradient colors={['#3C4CAC', '#F04393']} locations={[0.2, 1]} style={styles.gradient}>
          <View style={styles.nav}>
            <Pressable onPress={handleGoBack}>
              <MaterialIcons name="keyboard-backspace" size={28} color={'white'} />
            </Pressable>

            <Text style={[styles.text, { color: 'white' }]}>{language === 'en' ? 'Profile' : 'प्रोफाइल'}</Text>

            <Pressable onPress={handleNotificationBtn}>
              <Ionicons name="call-sharp" size={24} color="white" />
            </Pressable>
          </View>
        </LinearGradient>
      </View>


      <View style={{ height: height * 0.48 }}>
        <View style={styles.profileDetailsView}>
          <View style={styles.profileImageView}>
            <View style={styles.profileImageCircle}>
              <Image source={require('../../../assets/Cover.png')} style={styles.profileImage} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{language === 'en' ? 'Booth User' : 'बूथ  वापरकर्ता'}</Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <CustomeTextInput
              label={language === 'en' ? 'Username: ' : 'वापरकर्तानाव: '}
              valueDetails={userInfo?.user_name || ''}
              styles={styles.profileTextInput}
              readValue={true}
            />
            <CustomeTextInput
              label={language === 'en' ? 'User ID: ' : 'वापरकर्ता आयडी: '}
              valueDetails={userInfo?.user_id?.toString() || ''}
              styles={styles.profileTextInput}
              readValue={true}
            />
            <CustomeTextInput
              label={language === 'en' ? 'Phone: ' : 'फोन नंबर: '}
              valueDetails={userInfo?.user_phone || ''}
              styles={styles.profileTextInput}
              readValue={true}
            />
            <CustomeTextInput
              label={language === 'en' ? 'Town: ' : 'गाव/शहर : '}
              valueDetails={userInfo?.town_name || ''}
              styles={styles.profileTextInput}
              readValue={true}
            />
            <CustomeTextInput
              label={language === 'en' ? 'Booth: ' : 'बूथ: '}
              valueDetails={userInfo?.booth_names?.join(', ') || ''}
              styles={styles.profileTextInput}
              readValue={true}
            />
          </View>
        </View>
      </View>

      <View style={{ height: height * 0.12, justifyContent: 'center' }}>
        <Pressable style={styles.updateButton} onPress={() => navigation.navigate('LogOut')}>
          <Text style={styles.updateButtonTxt}>{language === 'en' ? 'Logout' : 'लॉगआउट'}</Text>
        </Pressable>
      </View>
    </>

  );
};

export default BuserProfile;

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
    padding: 10,
    paddingTop: '5%',
    paddingHorizontal: 20,
  },
  profileDetailsView: {
    height: height * 0.55,
    width: '90%',
    elevation: 2,
    borderRadius: 10,
    marginTop: '-15%',
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
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: width,
    borderColor: '#3C4CAC',
    marginTop: -70,
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
    marginVertical: 8,
    backgroundColor: 'rgba(236, 238, 247, 1)',
    fontSize: 18,
  },
  updateButton: {
    width: "90%",
    height: 50,
    backgroundColor: '#F04393',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  updateButtonTxt: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
