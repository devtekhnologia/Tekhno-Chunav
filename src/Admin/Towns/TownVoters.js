// import React, { useContext, useEffect, useState } from 'react';
// import { Alert, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, RefreshControl } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
// import axios from 'axios';
// import VoterDetailsPopUp from '../Voters/VoterDetailsPopUp';
// import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
// import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
// import { LanguageContext } from '../../ContextApi/LanguageContext';
// import EditVoterForm from '../../ReusableCompo/EditVoterForm';
// import CastModal from '../Voters/CastModals';


// const { width, height } = Dimensions.get('screen');

// const TownVoters = ({ route }) => {
//     const { townId } = route.params;
//     const { language } = useContext(LanguageContext);
//     const [voters, setVoters] = useState([]);
//     const [filteredVoters, setFilteredVoters] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchedValue, setSearchValue] = useState('');
//     const [sortState, setSortState] = useState(0);
//     const [initialVoters, setInitialVoters] = useState([]);
//     const [error, setError] = useState(null);

//     const [selectedVoter, setSelectedVoter] = useState(null);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [selectedVoters, setSelectedVoters] = useState([]);
//     const [isSelectionMode, setIsSelectionMode] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [selectAll, setSelectAll] = useState(false);

//     const fetchVoterDetails = (voter_id) => {
//         axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
//             .then(response => {
//                 setSelectedVoter(response.data);
//                 setIsModalVisible(true);
//             })
//             .catch(error => {
//                 Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
//             });
//     };

//     const handleVoterPress = (voter_id) => {
//         if (isSelectionMode) {
//             toggleVoterSelection(voter_id);
//         } else {
//             fetchVoterDetails(voter_id);
//         }
//     };

//     const toggleVoterSelection = (voter_id) => {
//         if (selectedVoters.includes(voter_id)) {
//             setSelectedVoters(selectedVoters.filter(id => id !== voter_id));
//         } else {
//             setSelectedVoters([...selectedVoters, voter_id]);
//         }
//     };

//     const handleLongPress = (voter_id) => {
//         setIsSelectionMode(true);
//         toggleVoterSelection(voter_id);
//     };

//     const exitSelectionMode = () => {
//         setIsSelectionMode(false);
//         setSelectedVoters([]);
//     };

//     useEffect(() => {
//         const searchTerms = searchedValue.toLowerCase().trim().split(/\s+/);

//         const filtered = voters.filter(voter => {
//             const voterName = voter.voter_name ? voter.voter_name.toLowerCase() : '';
//             const voterNameMar = voter.voter_name_mar ? voter.voter_name_mar.toLowerCase() : '';
//             const voterId = voter.voter_id ? voter.voter_id.toString() : '';

//             const voterNameParts = voterName.split(/\s+/);
//             const voterNameMarParts = voterNameMar.split(/\s+/);

//             return searchTerms.every(term =>
//                 voterId.includes(term) ||
//                 voterName.includes(term) ||
//                 voterNameMar.includes(term) ||
//                 voterNameParts.some(part => part.includes(term)) ||
//                 voterNameMarParts.some(part => part.includes(term)) ||
//                 voterName.startsWith(searchTerms.join(' ')) ||
//                 voterNameMar.startsWith(searchTerms.join(' '))
//             );
//         });

//         setFilteredVoters(filtered);
//     }, [searchedValue, voters]);

//     const toTitleCase = (str) => {
//         return str
//             .split(' ')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//             .join(' ');
//     };
//     const sortVotersAlphabetically = () => {
//         if (sortState === 0) {
//             // Sort A-Z
//             const sortedVoters = [...filteredVoters].sort((a, b) => {
//                 const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
//                 const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
//                 return nameA.localeCompare(nameB);
//             });
//             setFilteredVoters(sortedVoters);
//             setSortState(1);
//         } else if (sortState === 1) {
//             // Sort Z-A
//             const sortedVoters = [...filteredVoters].sort((a, b) => {
//                 const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
//                 const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
//                 return nameB.localeCompare(nameA);
//             });
//             setFilteredVoters(sortedVoters);
//             setSortState(2);
//         } else {
//             // Reset to default order (initial voters)
//             setFilteredVoters(initialVoters);
//             setSortState(0);
//         }
//     };

//     const fetchVoterData = async () => {
//         try {
//             const response = await axios.get(`http://192.168.1.24:8000/api/town_wise_voter_list/${townId}/`);
//             if (response.data && Array.isArray(response.data)) {
//                 setVoters(response.data);
//                 setFilteredVoters(response.data);
//                 setInitialVoters(response.data);
//             } else {
//                 setError('Unexpected API response format.');
//             }
//         } catch (error) {
//             console.error(error);
//             Alert.alert('Error fetching voter data', error.toString ? error.toString() : 'Unknown error');
//             setError('Error fetching data. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const onRefresh = async () => {
//         setRefreshing(true);
//         await fetchVoterData();
//         setRefreshing(false);
//     };

//     useEffect(() => {
//         fetchVoterData();
//     }, [townId]);


//     const getIconName = () => {
//         if (sortState === 0) {
//             return "sort";
//         } else if (sortState === 1) {
//             return "sort-alpha-down";
//         } else if (sortState === 2) {
//             return "sort-alpha-up-alt";
//         }
//     };


//     const renderItem = ({ item }) => {
//         let backgroundColor = 'white';

//         switch (item.voter_favour_id) {
//             case 1:
//                 backgroundColor = '#d3f5d3';
//                 break;
//             case 2:
//                 backgroundColor = '#f5d3d3';
//                 break;
//             case 3:
//                 backgroundColor = '#f5f2d3';
//                 break;
//             case 4:
//                 backgroundColor = '#c9daff';
//                 break;
//             case 5:
//                 backgroundColor = 'skyblue';
//                 break;
//             case 6:
//                 backgroundColor = '#fcacec';
//                 break;
//             case 7:
//                 backgroundColor = '#dcacfa';
//                 break;

//             default:
//                 backgroundColor = 'white';
//         }

//         return (

//             <Pressable
//                 style={[styles.voterItem, selectedVoters.includes(item.voter_id) && styles.selectedVoterItem, { backgroundColor }]}
//                 onPress={() => handleVoterPress(item.voter_id)}
//                 onLongPress={() => handleLongPress(item.voter_id)}
//             >

//                 <View style={styles.voterDetails}>
//                     <View style={{
//                         borderRightWidth: 1, borderColor: '#D9D9D9',
//                         width: 60, alignItems: 'center',
//                     }}>
//                         <Text>{item.voter_id}</Text>
//                     </View>
//                     <Text >{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
//                 </View>
//             </Pressable>
//         )
//     }

//     const [colorState, setColorState] = useState({
//         1: '#2ff55d', // Green
//         2: '#fc392b', // Red
//         3: '#dedb21', // Yellow
//         4: '#2832f7', // Sky Blue
//         5: '#21b9db', // Blue
//         6: '#f52cda', // Pink
//         7: '#ac1fed', // Purple
//         0: 'black'    // Black
//     });

//     const applyColorToSelected = async (colorKey) => {
//         const colorCode = colorState[colorKey];
//         const updatedVoters = filteredVoters.map(voter =>
//             selectedVoters.includes(voter.voter_id) ? { ...voter, voter_favour_id: colorKey } : voter
//         );
//         setFilteredVoters(updatedVoters);
//         for (let voter_id of selectedVoters) {
//             try {
//                 await sendCheckboxStateToAPI(voter_id, colorKey);
//             } catch (error) {
//                 console.error(`Failed to update voter ${voter_id}:`, error);
//             }
//         }
//         exitSelectionMode();
//     };
//     const sendCheckboxStateToAPI = async (voter_id, checkboxID) => {
//         try {
//             const response = await axios.put(`http://192.168.1.24:8000/api/favour/${voter_id}/`, {
//                 voter_favour_id: checkboxID,
//             });

//             if (response.status !== 200) {
//                 throw new Error('Failed to update checkbox state.');
//             }
//         } catch (error) {
//             console.error('Error updating checkbox state:', error.message);
//             alert('Failed to update checkbox state. Please try again.');
//         }
//     };

//     const handleSelectAll = () => {
//         if (selectAll) {
//             // Deselect all visible voters
//             const deselected = selectedVoters.filter(id => !filteredVoters.some(voter => voter.voter_id === id));
//             setSelectedVoters(deselected);
//         } else {
//             // Select all visible voters
//             const allVisibleVoterIds = filteredVoters.map(voter => voter.voter_id);
//             setSelectedVoters([...new Set([...selectedVoters, ...allVisibleVoterIds])]);
//         }
//         setSelectAll(!selectAll); // Toggle select all state
//     };

//     return (
//         <HeaderFooterLayout
//             headerText={language === 'en' ? `${route.params.townName} Voters` : `${route.params.townName} मतदार`}
//             showHeader={true}
//             showFooter={false}
//             leftIcon={true}
//             rightIcon={true}
//             leftIconName="keyboard-backspace"
//             rightIconName={getIconName()}
//             onRightIconPress={sortVotersAlphabetically}
//         >

//             <View style={styles.container}>
//                 <View style={styles.searchContainer}>
//                     <Ionicons name="search" size={20} color="grey" />
//                     <TextInput
//                         value={searchedValue}
//                         onChangeText={text => setSearchValue(text)}
//                         placeholder={language === 'en' ? "Search by voter’s name or ID" : "मतदाराचे नाव किंवा आयडी द्वारे शोधा"}
//                         style={styles.searchInput}
//                     />
//                 </View>

//                 {isSelectionMode && (
//                     <>
//                         <Pressable
//                             style={styles.selectAllButtonn}
//                             onPress={() => {
//                                 setCasteModalVisible(true);
//                             }}
//                         >
//                             <Text style={styles.selectAllTextt}>Assign Cast</Text>
//                         </Pressable>

//                         <View style={styles.colorToolbar}>
//                             <Pressable
//                                 style={styles.selectAllButton}
//                                 onPress={handleSelectAll}
//                             >
//                                 <Text style={styles.selectAllText}>
//                                     {selectAll ? 'Deselect All' : 'Select All'}
//                                 </Text>
//                             </Pressable>
//                             {Object.entries(colorState).map(([key, color]) => (
//                                 <Pressable
//                                     key={key}
//                                     style={[styles.colorCircle, { backgroundColor: color }]}
//                                     onPress={() => applyColorToSelected(parseInt(key))}
//                                 />
//                             ))}
//                             <Ionicons name="close-circle" size={30} color="red" onPress={exitSelectionMode} style={styles.actionIcon} />
//                         </View>
//                     </>
//                 )}


//                 <View style={styles.listContainer}>
//                     <FlatList
//                         data={filteredVoters}
//                         keyExtractor={item => item.voter_id.toString()}
//                         showsVerticalScrollIndicator={false}
//                         renderItem={renderItem}
//                         refreshControl={
//                             <RefreshControl
//                                 refreshing={refreshing}
//                                 onRefresh={onRefresh}
//                             />
//                         }
//                         ListHeaderComponent={loading && <LoadingListComponent />}
//                         ListEmptyComponent={!loading && <EmptyListComponent />}
//                     />
//                 </View>


//                 <VoterDetailsPopUp
//                     isModalVisible={isModalVisible}
//                     selectedVoter={selectedVoter}
//                     setIsModalVisible={setIsModalVisible}
//                 />
//             </View >
//         </HeaderFooterLayout >
//     )
// }

// export default TownVoters

// const styles = StyleSheet.create({
//     container: {
//         paddingHorizontal: 15,
//         height: '100%',
//     },
//     searchContainer: {
//         borderColor: '#9095A1',
//         borderWidth: 1.5,
//         borderRadius: 5,
//         height: 45,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//         columnGap: 20,
//         marginVertical: 10,
//     },
//     searchInput: {
//         flex: 1,
//         paddingVertical: 10,
//     },
//     selectionToolbar: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginVertical: 10,
//     },
//     actionIcon: {
//         paddingHorizontal: 15,
//     },
//     listContainer: {
//         flex: 1,
//     },
//     voterItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         marginVertical: 5,
//         borderRadius: 5,
//         borderWidth: 2,
//         borderColor: '#e0e0e0',
//     },
//     selectedVoterItem: {
//         borderColor: 'black',
//         borderWidth: 2,
//     },
//     voterDetails: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         columnGap: 10,
//     },
//     voterName: {
//         marginLeft: 10,
//         fontSize: 16,
//     },
//     noDataText: {
//         textAlign: 'center',
//         marginTop: 20,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     colorToolbar: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginBottom: 10,
//     },
//     colorCircle: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         marginHorizontal: 5,
//         borderWidth: 1,
//         borderColor: '#e0e0e0',
//     },
//     actionIcon: {
//         marginLeft: 10,
//     },
//     selectAllButton: {
//         backgroundColor: '#007bff',
//         borderRadius: 5,
//         padding: 10,
//         marginHorizontal: 5,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     selectAllText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });


import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import VoterDetailsPopUp from '../Voters/VoterDetailsPopUp';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import EditVoterForm from '../../ReusableCompo/EditVoterForm';
import CastModal from '../Voters/CastModals';
import { render } from 'react-dom';

export default function TownVoters({ route }) {
    const { townId } = route.params;
    const { language } = useContext(LanguageContext);
    const [voters, setVoters] = useState([]);
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedValue, setSearchValue] = useState('');
    const [sortState, setSortState] = useState(0);
    const [initialVoters, setInitialVoters] = useState([]);
    const [error, setError] = useState(null);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [selectedVoters, setSelectedVoters] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [isCasteModalVisible, setCasteModalVisible] = useState(false);
    const [castes, setCastes] = useState([]);
    // console.log("castes", castes);

    const [selectedCasteId, setSelectedCasteId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);



    const fetchVoterDetails = (voter_id) => {
        axios.get(`http://192.168.1.24:8000/api/voters/${voter_id}`)
            .then(response => {
                setSelectedVoter(response.data);
                setIsFormVisible(true);
            })
            .catch(error => {
                console.error(error);
                Alert.alert('Error', 'Failed to fetch voter details. Please try again.');
            });
    };

    const handleVoterPress = (voter_id) => {
        if (isSelectionMode) {
            toggleVoterSelection(voter_id);
        } else {
            fetchVoterDetails(voter_id);
        }
    };

    const toggleVoterSelection = (voter_id) => {
        setSelectedVoters(prevSelectedVoters => {
            if (prevSelectedVoters.includes(voter_id)) {
                return prevSelectedVoters.filter(id => id !== voter_id);
            } else {
                return [...prevSelectedVoters, voter_id];
            }
        });
    };

    const handleLongPress = (voter_id) => {
        setIsSelectionMode(true);
        toggleVoterSelection(voter_id);
    };

    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedVoters([]);
    };

    useEffect(() => {
        const searchTerms = searchedValue.toLowerCase().trim().split(/\s+/);

        const filtered = voters.filter(voter => {
            const voterName = voter.voter_name ? voter.voter_name.toLowerCase() : '';
            const voterNameMar = voter.voter_name_mar ? voter.voter_name_mar.toLowerCase() : '';
            const voterId = voter.voter_id ? voter.voter_id.toString() : '';

            const voterNameParts = voterName.split(/\s+/);
            const voterNameMarParts = voterNameMar.split(/\s+/);

            return searchTerms.every(term =>
                voterId.includes(term) ||
                voterName.includes(term) ||
                voterNameMar.includes(term) ||
                voterNameParts.some(part => part.includes(term)) ||
                voterNameMarParts.some(part => part.includes(term)) ||
                voterName.startsWith(searchTerms.join(' ')) ||
                voterNameMar.startsWith(searchTerms.join(' '))
            );
        });

        setFilteredVoters(filtered);
    }, [searchedValue, voters]);

    const sortVotersAlphabetically = () => {
        const sortedVoters = [...filteredVoters];
        if (sortState === 0) {
            sortedVoters.sort((a, b) => {
                const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
                const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
                return nameA.localeCompare(nameB);
            });
            setSortState(1);
        } else if (sortState === 1) {
            sortedVoters.sort((a, b) => {
                const nameA = a.voter_name ? a.voter_name.toLowerCase() : '';
                const nameB = b.voter_name ? b.voter_name.toLowerCase() : '';
                return nameB.localeCompare(nameA);
            });
            setSortState(2);
        } else {
            sortedVoters.sort((a, b) => a.voter_id - b.voter_id); // Default sort by ID
            setSortState(0);
        }
        setFilteredVoters(sortedVoters);
    };

    const fetchVoterData = async () => {
        try {
            const response = await axios.get(`http://192.168.1.24:8000/api/town_wise_voter_list/${townId}/`);
            if (response.data && Array.isArray(response.data)) {
                setVoters(response.data);
                setFilteredVoters(response.data);
                setInitialVoters(response.data);
            } else {
                setError('Unexpected API response format.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error fetching voter data', error.toString ? error.toString() : 'Unknown error');
            setError('Error fetching data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchVoterData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchVoterData();
    }, [townId]);

    const getIconName = () => {
        if (sortState === 0) return "sort";
        if (sortState === 1) return "sort-alpha-down";
        return "sort-alpha-up-alt";
    };

    const renderItem = ({ item, index }) => {
        const fixedIndex = index + 1;

        let backgroundColor = 'white';

        switch (item.voter_favour_id) {
            case 1:
                backgroundColor = '#d3f5d3';
                break;
            case 2:
                backgroundColor = '#f5d3d3';
                break;
            case 3:
                backgroundColor = '#f5f2d3';
                break;
            case 4:
                backgroundColor = '#c9daff';
                break;
            case 5:
                backgroundColor = 'skyblue';
                break;
            case 6:
                backgroundColor = '#fcacec';
                break;
            case 7:
                backgroundColor = '#dcacfa';
                break;

            default:
                backgroundColor = 'white';
        }



        return (

            <Pressable
                style={[styles.voterItem, selectedVoters.includes(item.voter_id) && styles.selectedVoterItem, { backgroundColor }]}
                onPress={() => handleVoterPress(item.voter_id)}
                onLongPress={() => handleLongPress(item.voter_id)}
            >

                <View style={styles.voterDetails}>
                    <View style={{
                        borderRightWidth: 1, borderColor: '#D9D9D9',
                        width: 60, alignItems: 'center',
                    }}>
                       {/* <Text>{item.voter_id}</Text> */}
                       <Text>{fixedIndex}</Text>
                    </View>
                    <Text >{language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
                </View>
            </Pressable>
        )
    }

    const handleSelectedVoterDetails = (newDetails) => {
        const updatedFilteredVoters = filteredVoters.map(voter =>
            voter.voter_id.toString() === newDetails.voter_id.toString() ? { ...voter, ...newDetails } : voter
        );
        setFilteredVoters(updatedFilteredVoters);
    };

    const handleCloseEditForm = () => {
        setIsFormVisible(false);
        setSelectedVoter(null);
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const [colorState, setColorState] = useState({
        1: 'green',
        2: '#fc392b',
        3: '#dedb21',
        4: '#2832f7',
        5: '#21b9db',
        6: '#f52cda',
        7: '#ac1fed',
        0: 'black'
    });

    const applyColorToSelected = async (colorKey) => {
        const colorCode = colorState[colorKey];
        const updatedVoters = filteredVoters.map(voter =>
            selectedVoters.includes(voter.voter_id) ? { ...voter, voter_favour_id: colorKey } : voter
        );
        setFilteredVoters(updatedVoters);
        for (let voter_id of selectedVoters) {
            try {
                await sendCheckboxStateToAPI(voter_id, colorKey);
            } catch (error) {
                console.error(`Failed to update voter ${voter_id}:`, error);
            }
        }
        exitSelectionMode();
    };
    const sendCheckboxStateToAPI = async (voter_id, checkboxID) => {
        try {
            const response = await axios.put(`http://192.168.1.24:8000/api/favour/`, {
                voter_ids: selectedVoters,
                voter_favour_id: checkboxID,
            });

            if (response.status !== 200) {
                throw new Error('Failed to update checkbox state.');
            }
        } catch (error) {
            console.error('Error updating checkbox state:', error.message);
            alert('Failed to update checkbox state. Please try again.');
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedVoters([]);
        } else {
            const allFilteredIds = filteredVoters.map(voter => voter.voter_id);
            setSelectedVoters(allFilteredIds);
        }
        setSelectAll(!selectAll);
    };

    return (
        <HeaderFooterLayout
            headerText={language === 'en' ? `${route.params.townName} Voters` : `${route.params.townName} मतदार`}
            showHeader={true}
            showFooter={false}
            leftIcon={true}
            rightIcon={true}
            leftIconName="keyboard-backspace"
            rightIconName={getIconName()}
            onRightIconPress={sortVotersAlphabetically}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder={language === 'en' ? 'Search by voter’s name or ID' : 'मतदाराचे नाव किंवा ओळखपत्राने शोधा'}
                        style={styles.searchInput}
                    />
                </View>

                {isSelectionMode && (
                    <>
                        <Pressable
                            style={styles.selectAllButtonn}
                            onPress={() => {
                                // fetchCastData();
                                setCasteModalVisible(true);
                            }}
                        >
                            <Text style={styles.selectAllTextt}>Assign Cast</Text>
                        </Pressable>

                        <View style={styles.colorToolbar}>
                            <Pressable
                                style={styles.selectAllButton}
                                onPress={handleSelectAll}
                            >
                                <Text style={styles.selectAllText}>
                                    {selectAll ? 'Deselect All' : 'Select All'}
                                </Text>
                            </Pressable>
                            {Object.entries(colorState).map(([key, color]) => (
                                <Pressable
                                    key={key}
                                    style={[styles.colorCircle, { backgroundColor: color }]}
                                    onPress={() => applyColorToSelected(parseInt(key))}
                                />
                            ))}
                            <Ionicons name="close-circle" size={30} color="red" onPress={exitSelectionMode} style={styles.actionIcon} />
                        </View>
                    </>
                )}

                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredVoters}
                        keyExtractor={item => item.voter_id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        ListHeaderComponent={loading && <LoadingListComponent />}
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />

                    <EditVoterForm
                        isVisible={isFormVisible}
                        onClose={handleCloseEditForm}
                        selectedVoter={selectedVoter}
                        onEditVoter={handleSelectedVoterDetails}
                    />

                        {isCasteModalVisible && (
                            <CastModal
                                isVisible={isCasteModalVisible}
                                onClose={() => setCasteModalVisible(false)}
                                selectedVoters={selectedVoters}
                                onAssignCaste={(casteId) => {
                                    setCasteModalVisible(false); 
                                    console.log(`Assigned caste ID ${casteId} to voters`, selectedVoters);
                                }}
                            />
                        )}
                </View>
            </View>
        </HeaderFooterLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        height: '100%',
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1.5,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        columnGap: 20,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    selectionToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    actionIcon: {
        // paddingHorizontal: 15,
    },
    listContainer: {
        flex: 1,
    },
    voterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    selectedVoterItem: {
        borderColor: 'black',
        borderWidth: 2,
    },
    voterDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    },
    voterName: {
        marginLeft: 10,
        fontSize: 16,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorToolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
    colorCircle: {
        width: 22,
        height: 22,
        borderRadius: 30,
        marginHorizontal: 3,
    },
    actionIcon: {
        marginLeft: 8,
    },
    selectAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#007BFF',
        marginRight: 5,
    },
    selectAllText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    selectAllButtonn: {
        alignSelf: 'center',
        width: '60%',
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    selectAllTextt: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    casteItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    selectedCasteItem: {
        backgroundColor: '#d3f5d3',
    },
    modalButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#007BFF',
    },
    cancelButton: {
        backgroundColor: '#DC3545',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
