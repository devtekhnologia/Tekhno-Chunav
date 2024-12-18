import { Dimensions, Modal, StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable, Keyboard, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ColorLegendModal from './ColorLegendModal';

const { height, width } = Dimensions.get('screen');

const BoothEditVoterForm = ({ isVisible, onClose, selectedVoter, onEditVoter }) => {
    const [name, setName] = useState('');
    const [parentName, setParentName] = useState('');
    const [contact, setContact] = useState(null);
    const [voterFavourType, setVoterFavourType] = useState(null)
    const [caste, setCaste] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [maritalStatus, setMaritalStatus] = useState(null);
    const [gender, setGender] = useState(null);
    const [age, setAge] = useState(null)
    const [loading, setLoading] = useState(false);
    const [casteOptions, setCasteOptions] = useState([]);
    const [townName, setTownName] = useState(null);
    const [boothName, setBoothName] = useState(null);

    const [openCaste, setOpenCaste] = useState(false);
    const [openCurrentStatus, setOpenCurrentStatus] = useState(false);
    const [openMaritalStatus, setOpenMaritalStatus] = useState(false);
    const [openGender, setOpenGender] = useState(false);

    const [color, setColor] = useState('black');
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedButtonId, setSelectedButtonId] = useState(null);

    const [location, setLocation] = useState('');
    const [filteredVoters, setFilteredVoters] = useState([]);

    const statusOptions = [{ label: 'Alive', value: 1 }, { label: 'Dead', value: 2 }];
    const maritalOptions = [{ label: 'Single', value: 1 }, { label: 'Married', value: 2 }];
    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
    ];


    const handleSelectedVoterType = (item) => {
        setVoterFavourType(item.id);
        setTypeColor(item.id)


        const voterId = selectedVoter.voter_id;
        if (voterId && item.id) {
            sendCheckboxStateToAPI(voterId, item.id)
        }
    };


    const setTypeColor = (id) => {
        let selectedColor = 'black';

        switch (Number(id)) {
            case 1:
                selectedColor = '#188357';
                break;
            case 2:
                selectedColor = '#FF3030';
                break;
            case 3:
                selectedColor = '#FBBE17';
                break;
            case 4:
                selectedColor = '#0284f5';
                break;
            case 5:
                selectedColor = 'skyblue';
                break;
            case 6:
                selectedColor = 'pink';
                break;
            case 7:
                selectedColor = 'purple';
                break;
        }

        setColor(selectedColor);
    }


    const sendCheckboxStateToAPI = async (voterIds, checkboxID) => {
        try {
            const payload = {
                voter_ids: Array.isArray(voterIds) ? voterIds : [voterIds], // Ensure voterIds is an array
                voter_favour_id: checkboxID,
            };

            const response = await axios.put('http://192.168.1.38:8000/api/favour/', payload);

            if (response.status === 200) {
                setFilteredVoters(prevFilteredVoters =>
                    prevFilteredVoters.map(voter =>
                        payload.voter_ids.includes(voter.voter_id)
                            ? { ...voter, voter_favour_id: checkboxID }
                            : voter
                    )
                );
                Alert.alert('Success', 'Checkbox state updated successfully!');
            } else {
                throw new Error('Failed to update checkbox state. Please try again.');
            }
        } catch (error) {
            console.error('Error updating checkbox state:', error.message);
            Alert.alert('Error', 'Failed to update checkbox state. Please try again.');
        }
    };



    const fetchCasteData = async () => {
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/cast/');
            const casteData = response.data.map(cast => ({
                label: `${cast.cast_id} - ${cast.cast_name}`,
                value: cast.cast_id,
            }));
            setCasteOptions(casteData);
        } catch (error) {
            console.error('Error fetching caste data:', error.toString ? error.toString() : 'Unknown error');
            Alert.alert('Error', 'Failed to load caste data');
        }
    };


    useEffect(() => {
        if (selectedVoter) {
            setName(selectedVoter.voter_name || '');
            setParentName(selectedVoter.voter_parent_name || '');
            setContact(selectedVoter.voter_contact_number?.toString() || '');
            setCaste(selectedVoter.voter_cast_id || null);
            setCurrentStatus(selectedVoter.voter_live_status_id || null);
            setMaritalStatus(selectedVoter.voter_marital_status_id || null);
            setGender(selectedVoter.voter_gender || null);
            setAge(selectedVoter.voter_age ? Number(selectedVoter.voter_age) : null);
            setVoterFavourType(selectedVoter.voter_favour_id || null);
            setSelectedButtonId(selectedVoter.voter_in_city_id || null);
            setLocation(selectedVoter.voter_current_location || null)
            setTownName(selectedVoter.town_name || null)
            setBoothName(selectedVoter.booth_name || null)
            setVoterFavourType(selectedVoter.voter_favour_id)
            setTypeColor(selectedVoter.voter_favour_id)
        } else {
            setName('');
            setParentName('');
            setContact('');
            setCaste(null);
            setCurrentStatus(null);
            setMaritalStatus(null);
            setGender(null);
            setAge(null);
            setVoterFavourType(null);
            setSelectedButtonId(null);
            setLocation(null)
        }

        fetchCasteData();
    }, [selectedVoter]);


    const handleCloseModal = () => {
        setModalVisible(false)
    }


    const handleCloseEditForm = () => {
        onClose()
    }

    const handlePdfIconClick = async (voterId) => {
        try {
            const response = await axios.get(`http://192.168.1.38:8000/api/generate_voter_pdf/${voterId}`, {
                params: { voter_id: voterId },
                responseType: 'arraybuffer',
            });


            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );


            const fileUri = FileSystem.documentDirectory + `voter_${voterId}.pdf`;


            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            Alert.alert('Success', 'PDF has been saved to your device!');

            // Share or open the PDF file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }

        } catch (error) {
            console.error('Error downloading PDF:', error.toString ? error.toString() : 'Unknown error');
            Alert.alert('Error', 'Failed to download the PDF.');
        }
    };


    const handleSubmit = async () => {
        setLoading(true);


        let updatedFields = {};

        if (name !== '') updatedFields.voter_name = name;
        if (parentName !== '') updatedFields.voter_parent_name = parentName;
        if (contact !== '') updatedFields.voter_contact_number = contact;
        if (caste !== '') updatedFields.voter_cast_id = caste;
        if (age !== '') updatedFields.voter_age = age;
        if (gender !== '') updatedFields.voter_gender = gender;
        if (currentStatus !== '') updatedFields.voter_live_status_id = currentStatus;
        if (maritalStatus !== '') updatedFields.voter_marital_status_id = maritalStatus;
        if (voterFavourType !== '') updatedFields.voter_favour_id = voterFavourType;
        if (selectedButtonId !== '') updatedFields.voter_in_city_id = selectedButtonId;
        if (location !== '') updatedFields.voter_current_location = location;



        if (name === '') updatedFields.voter_name = null;
        if (parentName === '') updatedFields.voter_parent_name = null;
        if (contact === '') updatedFields.voter_contact_number = null;
        if (caste === '') updatedFields.voter_cast_id = null;
        if (age === '') updatedFields.voter_age = null;
        if (gender === '') updatedFields.voter_gender = null;
        if (currentStatus === '') updatedFields.voter_live_status_id = null;
        if (maritalStatus === '') updatedFields.voter_marital_status_id = null;
        if (voterFavourType === '') updatedFields.voter_favour_id = null;

        try {
            const apiUrl = `http://192.168.1.38:8000/api/voters/${selectedVoter.voter_id}/`;
            const response = await axios.patch(apiUrl, updatedFields);

            if (response.status === 200) {
                Alert.alert("Success", "Voter details updated successfully.");

                handleCloseEditForm();
            } else {
                throw new Error('Failed to update voter details');
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update voter details. Please try again.");
            console.error('Error updating voter details:', error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleCompareSubmit = async () => {
        setLoading(true);

        const apiUrl = `http://192.168.1.38:8000/api/compare_voter_data/`;

        // Prepare updated fields with null values for empty fields
        const updatedFields = {
            voter_id: selectedVoter.voter_id,
            voter_name: name !== '' ? name : null,
            voter_parent_name: parentName !== '' ? parentName : null,
            voter_contact_number: contact !== '' ? contact : null,
            voter_cast_id: caste !== '' ? caste : null,
            voter_age: age !== '' ? age : null,
            voter_gender: gender !== '' ? gender : null,
            voter_live_status_id: currentStatus !== '' ? currentStatus : null,
            voter_marital_status_id: maritalStatus !== '' ? maritalStatus : null,
            voter_favour_id: voterFavourType !== '' ? voterFavourType : null,
            voter_in_city_id: selectedButtonId !== '' ? selectedButtonId : null,
            voter_current_location: location !== '' ? location : null,
        };

        try {
            const response = await axios.post(apiUrl, updatedFields, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to update voter information.');
            }

            // Update the voters and filteredData state with the new information
            // setVoters(prevVoters =>
            //     prevVoters.map(item =>
            //         item.voter_id === selectedVoter.voter_id
            //             ? {
            //                   ...item,
            //                   voter_name: name,
            //                   voter_parent_name: parentName,
            //                   voter_contact_number: contact,
            //                   caste: caste,
            //                   age: age,
            //                   gender: gender,
            //                   status: currentStatus,
            //                   engaged: maritalStatus,
            //                   button_id: selectedButtonId,
            //                   location: location,
            //               }
            //             : item
            //     )
            // );

            // setFilteredData(prevFiltered =>
            //     prevFiltered.map(item =>
            //         item.voter_id === selectedVoter.voter_id
            //             ? {
            //                   ...item,
            //                   voter_name: name,
            //                   voter_parent_name: parentName,
            //                   voter_contact_number: contact,
            //                   caste: caste,
            //                   age: age,
            //                   gender: gender,
            //                   status: currentStatus,
            //                   engaged: maritalStatus,
            //                   button_id: selectedButtonId,
            //                   location: location,
            //               }
            //             : item
            //     )
            // );

            Alert.alert("Success", "Voter details updated successfully.");
            handleCloseEditForm();
        } catch (error) {
            console.error('Error updating voter information:', error.message);
            Alert.alert("Error", "Failed to update voter information. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleHexButtonClick = (id) => {
        setSelectedButtonId(id);
    };



    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <Pressable style={styles.modalBackground} onPress={onClose}>
                <Pressable style={styles.modalContainer} onPress={Keyboard.dismiss}>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>Edit Voter Details</Text>
                        <View style={{
                            flexDirection: 'row',
                            columnGap: width * 0.05

                        }}>
                            <TouchableOpacity onPress={() => handlePdfIconClick(selectedVoter.voter_id)}>
                                <FontAwesome name="file-pdf-o" size={22} color="#db2b1f" style={styles.pdfIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setModalVisible(true) }}>
                                <Ionicons name="radio-button-on" size={24} color={color} />
                            </TouchableOpacity>
                        </View>
                    </View>


                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder='Enter name here...'
                        style={styles.input}
                    />
                    <TextInput
                        value={parentName}
                        onChangeText={setParentName}
                        placeholder='Enter parent name here...'
                        style={styles.input}
                    />
                    <TextInput
                        value={contact}
                        onChangeText={setContact}
                        placeholder='Enter contact no. here...'
                        keyboardType='phone-pad'
                        style={styles.input}
                        
                    />

                    <DropDownPicker
                        open={openCaste}
                        value={caste}
                        items={casteOptions}
                        setOpen={setOpenCaste}
                        setValue={setCaste}
                        placeholder='Caste'
                        style={[styles.dropdown, { zIndex: 9999 }]}
                    />
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <DropDownPicker
                                open={openCurrentStatus}
                                value={currentStatus}
                                items={statusOptions}
                                setOpen={setOpenCurrentStatus}
                                setValue={setCurrentStatus}
                                placeholder='Current Status'
                                dropDownContainerStyle={{ zIndex: 999 }}
                                style={[styles.dropdown, { zIndex: 999 }]}
                            />
                            <TextInput
                                value={age ? age.toString() : ''}
                                onChangeText={(text) => setAge(text ? Number(text) : null)}
                                placeholder='Enter age here...'
                                keyboardType='numeric'
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.column}>
                            <DropDownPicker
                                open={openMaritalStatus}
                                value={maritalStatus}
                                items={maritalOptions}
                                setOpen={setOpenMaritalStatus}
                                setValue={setMaritalStatus}
                                placeholder='Marital Status'
                                dropDownContainerStyle={{ zIndex: 999 }}
                                style={[styles.dropdown, { zIndex: 999 }]}
                            />
                            <DropDownPicker
                                open={openGender}
                                value={gender}
                                items={genderOptions}
                                setOpen={setOpenGender}
                                setValue={setGender}
                                placeholder='Gender'
                                dropDownContainerStyle={{ zIndex: 99 }}
                                style={[styles.dropdown, { zIndex: 99 }]}
                            />
                        </View>
                    </View>

                    <View style={styles.hexButtonContainer}>
                        {[
                            { label: 'In', id: 1 },
                            { label: 'Near', id: 2 },
                            { label: 'Out', id: 3 },
                        ].map(({ label, id }) => (
                            <TouchableOpacity
                                key={id}
                                style={[
                                    styles.hexButton,
                                    selectedButtonId === id && styles.selectedHexButton,
                                ]}
                                onPress={() => handleHexButtonClick(id)}
                            >
                                <Text style={styles.hexButtonText}>{label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>


                    <TextInput
                        style={[
                            styles.locationInput,
                            selectedButtonId === 2 || selectedButtonId === 3
                                ? styles.activeInput
                                : styles.inactiveInput
                        ]}
                        placeholder="Enter current location"
                        value={location}
                        onChangeText={setLocation}
                        editable={selectedButtonId === 2 || selectedButtonId === 3}
                    />


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <TouchableOpacity onPress={handleCloseEditForm} style={styles.cancelButton}>
                            <Text style={{ color: '#E54394', textAlign: 'center', paddingVertical: 10, fontSize: 17, fontWeight: '600' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                            <Text style={{ color: 'white', textAlign: 'center', paddingVertical: 10, fontSize: 17, fontWeight: '600' }}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable >
            </Pressable >

            <ColorLegendModal
                isVisible={modalVisible}
                closeModal={handleCloseModal}
                onSelect={handleSelectedVoterType}
            />
        </Modal >
    );
};

export default BoothEditVoterForm;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: width * 0.9,
        borderRadius: 10,
        padding: 20,
        paddingVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    dropdown: {
        marginVertical: 10,
        width: "100%",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
    },
    column: {
        flex: 1,
    },
    cancelButton: {
        borderWidth: 1.5,
        borderColor: '#E54394',
        flex: 1,
        borderRadius: 5,
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#E54394',
        flex: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        flexWrap: 'wrap'
    },
    label: {
        flex: 0.4,
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        flex: 0.6,
        fontSize: 16,
        textAlign: 'left',
    },

    hexButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    hexButton: {
        width: 50,
        height: 50,
        backgroundColor: '#9c9a9a',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '45deg' }],
        borderRadius: 5,
    },
    selectedHexButton: {
        backgroundColor: '#080707',
    },
    hexButtonText: {
        color: '#fff',
        fontSize: 18,
        transform: [{ rotate: '-45deg' }],
    },
    locationInput: {
        backgroundColor: '#fff',
        borderColor: '#E2E2E2',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 18,
        color: '#000',
        width: '100%',
        marginBottom: 10,
    },
    activeInput: {
        borderWidth: 1.5,
        borderColor: 'black',
    },
    inactiveInput: {
        borderColor: '#ddd',
        backgroundColor: '#f5f5f5',
    },
});
