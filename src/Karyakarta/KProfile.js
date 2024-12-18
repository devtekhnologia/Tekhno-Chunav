import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { KaryakartaContext } from '../ContextApi/KaryakartaContext';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function KProfile() {
  const { KuserId } = useContext(KaryakartaContext)
  const navigation = useNavigation();
  const [profileDetails, setProfileDetails] = useState()
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNotificationBtn = () => {
    alert("Notification Pressed...");
  };

  const getKaryakartaDetails = async () => {
    try {
      const response = await axios.get(`http://192.168.1.38:8000/api/get_voter_group_details_by_user/${KuserId}/`);
      const karyakartaDetails = response.data;
      setProfileDetails(karyakartaDetails);
      console.log(karyakartaDetails);
    } catch (error) {
      console.error('Error fetching karyakarta details:', error);
    }
  };
  useEffect(() => {
    getKaryakartaDetails();
  }, [KuserId]);

  return (
    <>
      <StatusBar style='light' />
      <LinearGradient
        colors={['#3C4CAC', '#F04393']}
        locations={[0.2, 1]}
        style={styles.gradient}
      >
        <Pressable onPress={handleGoBack}>
          <MaterialIcons name="keyboard-backspace" size={28} color="white" />
        </Pressable>
        <Text style={styles.text}>
          Profile
        </Text>
        <Pressable onPress={handleNotificationBtn}>
          <AntDesign name="bells" size={width * 0.06} color="white" />
        </Pressable>
      </LinearGradient>

      <View style={styles.profileDetailsView}>
        <View style={styles.profileImageView}>
          <View style={styles.profileImageCircle}>
            <Image source={require('../../assets/Votee.png')} style={styles.profileImage} />
          </View>
          <Text style={styles.profileNameText}>
            Karyakarta
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <TextInput
            style={styles.profileTextInput}
            value={`User Name: ${profileDetails?.group_user_name}`}
            editable={false}
          />
          <TextInput
            style={styles.profileTextInput}
            value={`User Id: ${profileDetails?.voter_group_user_id}`}
            editable={false}
          />
          <TextInput
            style={styles.profileTextInput}
            value={`Contact No.: ${profileDetails?.group_user_contact}`}
            editable={false}
          />
          <TextInput
            style={styles.profileTextInput}
            value={`Group Name: ${profileDetails?.voter_group_name}`}
            editable={false}
          />
        </View>
      </View>

      <Pressable style={styles.logOutButton} onPress={() => { navigation.navigate('LogOut') }}>
        <Text style={styles.logOutButtonTxt}>
          Log Out
        </Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: width * 0.025,
    height: height * 0.35,
    flexDirection: 'row',
    paddingTop: height * 0.05,
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  profileDetailsView: {
    height: height * 0.55,
    width: "90%",
    elevation: 10,
    borderRadius: width * 0.03,
    marginTop: -height * 0.08,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: width * 0.05,
    marginBottom: '15%',
  },
  profileImageView: {
    width: '100%',
    alignItems: 'center',
  },
  profileImageCircle: {
    width: width * 0.25,
    height: width * 0.25,
    borderWidth: 2,
    borderRadius: width * 0.125,
    borderColor: '#3C4CAC',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.09,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.125,
  },
  profileNameText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: height * 0.02,
  },
  detailsContainer: {
    marginTop: height * 0.01,
    width: '100%',
    alignItems: 'center',
  },
  profileTextInput: {
    width: '100%',
    height: height * 0.06,
    borderRadius: width * 0.05,
    paddingStart: width * 0.05,
    marginVertical: height * 0.01,
    backgroundColor: 'rgba(236, 238, 247, 1)',
    fontSize: width * 0.04,
  },
  logOutButton: {
    width: width * 0.4,
    backgroundColor: '#F04393',
    alignSelf: 'center',
    marginBottom: '30%',
    borderRadius: width * 0.02,
    padding: height * 0.015,
  },
  logOutButtonTxt: {
    color: 'white',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
});


