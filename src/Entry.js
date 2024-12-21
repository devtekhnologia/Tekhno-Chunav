// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Dimensions, ImageBackground, Image, Alert } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { createTownsTable, dropTownsTable, getAllTowns } from './Db/TownTableHelper';
// import { createBoothsTable, dropBoothsTable, getAllBooths, insertBooth } from './Db/BoothTableHelper';
// import { closeDatabase, createTotalVotersTable, dropTotalVotersTable, getVotersFromTotalVotersTable, insertWashimTotalVoter } from './Db/TotalVotersHelper';
// import WashimVoterContext from './Admin/Context_Api/WashimVoterContext';
// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';
// import * as Location from 'expo-location';
// import axios from 'axios';
// import { createTotalVotersBGTable, createVotedVoterTable, dropTotalVotersBGTable, dropVotedVoterTable, getVotersFromTotalVotersBGTable, insertTotalVoter } from './Admin/Voters/SQLiteHelper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BoothsContext } from './Admin/Context_Api/BoothContext';

// const { height, width } = Dimensions.get('window');

// const BACKGROUND_TASK = 'background-voter-task';
// const LOCATION_TASK_NAME = 'background-location-task';


// const startBackgroundTask = async () => {
//   try {
//     const status = await BackgroundFetch.getStatusAsync();

//     if (status !== undefined) {
//       await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
//         minimumInterval: 60,
//         stopOnTerminate: false,
//         startOnBoot: true,
//         enabled: true,
//       });

//       console.log('Background task registered successfully');
//     } else {
//       console.error('Background fetch is restricted. Cannot register task.');
//     }
//   } catch (error) {
//     console.error('Error registering background task:', error);
//   }
// };


// // TaskManager.defineTask(BACKGROUND_TASK, async () => {
// //   try {
// //     console.log("Running background task...");

// //     await createTotalVotersBGTable();

// //     const allRows = await getVotersFromTotalVotersBGTable();
// //     console.log("Fetched rows from DB. Total rows:", allRows.length);

// //     const response = await axios.get('http://4.172.246.116:8000/api/total_voters/');
// //     console.log('API Response:', response.data);

// //     if (response && response.data) {
// //       await insertTotalVoter(response.data);
// //       console.log('Inserted new data into DB');
// //       return BackgroundFetch.Result.NewData;
// //     } else {
// //       console.error('API response was empty or invalid.');
// //       return BackgroundFetch.Result.Failed;
// //     }
// //   } catch (error) {
// //     console.error("Error running background task:", error.message);
// //     return BackgroundFetch.Result.Failed;
// //   }
// // });


// TaskManager.defineTask(BACKGROUND_TASK, async () => {
//   try {
//     console.log("Running background task...");

//     const allRows = await getVotersFromTotalVotersBGTable();
//     console.log("Fetched rows from DB. Total rows:", allRows.length);

//     const response = await axios.get('http://4.172.246.116:8000/api/booths/');
//     const formattedBooths = response.data;
//     setBooths(formattedBooths);
//     formattedBooths.forEach(booth => { insertBooth(booth) })

//     Alert.alert('Success', 'Booths fetched successfully!');

//   } catch (error) {
//     console.error("Error running background task:", error.message);
//     return BackgroundFetch.Result.Failed;
//   }
// });


// export default function Welcome({ navigation }) {
//   const { setWashimVoters } = useContext(WashimVoterContext);
//   const { booths, setBooths } = useContext(BoothsContext);
//   const [setUpStarted, setSetUpStarted] = useState(false);


//   const initializeTables = async () => {
//     await createTotalVotersBGTable();
//     await createTotalVotersTable();
//     await createVotedVoterTable();
//     await createTownsTable();
//     await createBoothsTable();

//     const lastVoter = await AsyncStorage.getItem('WashimTablelastInsertedRowId');
//     console.log("Last voter :: ", lastVoter);

//     const allRows = await getVotersFromTotalVotersTable();
//     console.log("All washim total rows length :: ", allRows.length);
//     setWashimVoters(allRows);

//     const allBooths = await getAllBooths();
//     console.log("", allBooths.length);
//     setBooths(allBooths);

//     if (allBooths.length === 0) {
//       await startBackgroundTask();
//     }

//     await closeDatabase();
//     navigation.replace('AdminBottomNav');
//   };


//   const getWashimVoters = async () => {
//     try {
//       setSetUpStarted(true);
//       const response = await axios.get(`http://4.172.246.116:8000/api/town_wise_voter_list/139/`)
//       const result = response.data;

//       setWashimVoters(result);
//       console.log("Voters data :: ", result.length);

//       insertWashimTotalVoter(result);
//     } catch (error) {
//       console.error('Error fetching voter data:', error);
//       setError('Error fetching data. Please try again later.');
//     } finally {
//       console.log("Finally");
//       setSetUpStarted(false);
//       // await closeDatabase();
//     }
//   };



//   // useEffect(() => {
//   //   setTimeout(() => {
//   //     initializeTables();
//   //   }, 3000);
//   // }, [navigation])



//   return (
//     <LinearGradient
//       colors={['#3C4CAC', '#F04393']}
//       locations={[0.65, 1]}
//       style={styles.container}
//     >
//       <View style={styles.photoContainer}>
//         <ImageBackground
//           source={require('../assets/Cover.png')}
//           style={[styles.profileImage, { opacity: 0.2 }]}
//           imageStyle={{ borderBottomLeftRadius: 370, borderBottomRightRadius: 370 }}
//         />
//       </View>

//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../assets/tekhnoblue.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>

//       <View style={styles.smallCircleContainer}>
//         <Image source={require('../assets/Votee.png')} style={styles.smallCircleImage} />
//       </View>

//       <Text style={styles.text}>Your gateway to get Vote Prediction</Text>


//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   photoContainer: {
//     width: width * 1.5,
//     height: height * 0.65,
//     borderBottomLeftRadius: 370,
//     borderBottomRightRadius: 370,
//     overflow: 'hidden',
//     backgroundColor: '#FFFFFF',
//     position: 'absolute',
//     top: 0,
//     left: -width * 0.25,
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//     justifyContent: 'center',
//   },
//   logoContainer: {
//     width: width * 0.5,
//     height: width * 0.5,
//     borderRadius: (width * 0.3) / 2,
//     overflow: 'hidden',
//     backgroundColor: 'transparent',
//     position: 'absolute',
//     top: height * 0.3 - (width * 0.25),
//     left: width * 0.5 - (width * 0.25),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: '100%',
//     height: '100%',
//   },
//   smallCircleContainer: {
//     width: width * 0.25,
//     height: width * 0.25,
//     borderRadius: (width * 0.25) / 2,
//     overflow: 'hidden',
//     backgroundColor: '#FFFFFF',
//     position: 'absolute',
//     top: height * 0.65 - (width * 0.125),
//     left: width * 0.5 - (width * 0.125),
//     borderWidth: 5,
//     borderColor: '#FFFFFF',
//   },
//   smallCircleImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   text: {
//     fontSize: 24,
//     color: 'black',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: height * 0.45,
//   },
// });




import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createTownsTable } from './Db/TownTableHelper';
import { createBoothsTable } from './Db/BoothTableHelper';
import { closeDatabase, createTotalVotersTable, getVotersFromTotalVotersTable, insertVoterInTotalVotersTable, } from './Db/TotalVotersHelper';
import WashimVoterContext from './Admin/Context_Api/WashimVoterContext';
import axios from 'axios';
import { createTotalVotersBGTable, createVotedVoterTable } from './Admin/Voters/SQLiteHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const { height, width } = Dimensions.get('window');

export default function Welcome({ navigation }) {
  const { washimVoters, setWashimVoters, wshmVtrCount, setWshmVtrCount } = useContext(WashimVoterContext);
  const [modalVisible, setModalVisible] = useState(false);


  const initializeTables = async () => {
    try {
      await createTotalVotersBGTable();
      await createTotalVotersTable();
      await createVotedVoterTable();
      await createTownsTable();
      await createBoothsTable();

      const lastVoter = await AsyncStorage.getItem('WashimTablelastInsertedRowId');
      console.log("Last voter :: ", lastVoter);

      const allRows = await getVotersFromTotalVotersTable();
      console.log("All washim total rows length :: ", allRows.length);
      setWashimVoters(allRows);
      setWshmVtrCount(allRows.length);
      closeDatabase();

      if (allRows.length < 60000) {
        setModalVisible(true);
        await getWashimVoters();
      } else {
        getWashimVoters();
      }
      navigation.replace('AdminBottomNav');

    } catch (error) {
      console.error('Error initializing tables:', error);
    };
  };

  const getWashimVoters = async () => {
    try {
      const response = await axios.get(`http://4.172.246.116:8000/api/get_nagar_parishad_total_voters`)
      const result = response.data;
      setWashimVoters(result);
      console.log("Voters data :: ", result.length);

      const lastVoter = await AsyncStorage.getItem('WashimTablelastInsertedRowId');
      console.log("Last voter :: ", lastVoter);

      let startIndex = 0;
      const CHUNK_SIZE = 5000;

      if (lastVoter) {
        startIndex = result.findIndex(voter => voter.voter_id === parseInt(lastVoter)) + 1;
      }
      console.log("Start index :: ", startIndex);

      const insertVotersInChunks = async () => {
        try {
          setModalVisible(true);

          const insertPromises = [];
          let i = startIndex;
          for (let i = startIndex; i < result.length; i += CHUNK_SIZE) {
            const chunk = result.slice(i, i + CHUNK_SIZE);
            await new Promise(resolve => setTimeout(resolve, 5000));

            insertPromises.push(
              ...chunk.map(voter => insertVoterInTotalVotersTable(voter))
            );

            if (insertPromises.length >= 1000) {
              await Promise.all(insertPromises);
              insertPromises.length = 0;

              console.log(`${i + 1} batch inserted, pausing for 5 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 5000));
              console.log('Resuming insertion...');
            }
          }

          if (insertPromises.length > 0) {
            await Promise.all(insertPromises);
          }
          console.log("All data inserted successfully");
        } catch (error) {
          console.error('Error inserting data:', error);
          Alert.alert('Error', 'Failed to insert data. Please try again.');
        }
      }

      await insertVotersInChunks();

    } catch (error) {
      console.error('Error fetching voter data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setModalVisible(false);
      await closeDatabase();
    }
  };


  useEffect(() => {
    setTimeout(() => {
      initializeTables();
    }, 1000);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#3C4CAC', '#F04393']}
      locations={[0.65, 1]}
      style={styles.container}
    >
      <StatusBar style="light" translucent={true} backgroundColor='rgba(253, 253, 253, 0)' />
      <View style={styles.photoContainer}>
        <ImageBackground
          source={require('../assets/Cover.png')}
          style={[styles.profileImage, { opacity: 0.2 }]}
          imageStyle={{ borderBottomLeftRadius: 370, borderBottomRightRadius: 370 }}
        />
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/tekhnoblue.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.smallCircleContainer}>
        <Image source={require('../assets/Votee.png')} style={styles.smallCircleImage} />
      </View>

      <Text style={styles.text}>Your gateway to get Vote Prediction</Text>

      {/* Modal to show setup progress */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => { }}
      >
        <StatusBar backgroundColor="rgba(253, 253, 253, 0)" ranslucent={true} />
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#F04393" />
            <Text style={styles.modalText}>Setting up voters, please wait...</Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoContainer: {
    width: width * 1.5,
    height: height * 0.65,
    borderBottomLeftRadius: 370,
    borderBottomRightRadius: 370,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: -width * 0.25,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: height * 0.3 - (width * 0.25),
    left: width * 0.5 - (width * 0.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  smallCircleContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: height * 0.65 - (width * 0.125),
    left: width * 0.5 - (width * 0.125),
    borderWidth: 5,
    borderColor: '#FFFFFF',
  },
  smallCircleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: height * 0.45,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    marginTop: 10,
    fontSize: 18,
    color: '#000',
  },
});
