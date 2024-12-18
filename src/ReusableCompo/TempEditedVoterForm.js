import { Dimensions, Modal, StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable, Keyboard, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

const { height, width } = Dimensions.get('screen');

const TempEditedVoterForm = ({ isVisible, onClose, selectedVoter, onEditVoter }) => {
    const [name, setName] = useState('');
    const [parentName, setParentName] = useState('');
    const [contact, setContact] = useState(null);
    const [caste, setCaste] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [maritalStatus, setMaritalStatus] = useState(null);
    const [gender, setGender] = useState(null);
    const [age, setAge] = useState(null)

    const [loading, setLoading] = useState(false);
    const [openCaste, setOpenCaste] = useState(false);
    const [openCurrentStatus, setOpenCurrentStatus] = useState(false);
    const [openMaritalStatus, setOpenMaritalStatus] = useState(false);
    const [openGender, setOpenGender] = useState(false);

    const [casteOptions, setCasteOptions] = useState([]);
    const statusOptions = [{ label: 'Alive', value: 1 }, { label: 'Dead', value: 2 }];
    const maritalOptions = [{ label: 'Single', value: 1 }, { label: 'Married', value: 2 }];


    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
    ];

    const fetchCasteData = async () => {
        try {
            const response = await axios.get('http://192.168.1.38:8000/api/cast/');
            const casteData = response.data.map(cast => ({
                label: `${cast.cast_id} - ${cast.cast_name}`,
                value: cast.cast_id,
            }));
            setCasteOptions(casteData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load caste data');
        }
    };

    useEffect(() => {
        if (selectedVoter) {
            setName(selectedVoter.temp_voter_data_voter_name || '');
            setParentName(selectedVoter.temp_voter_data_voter_parent_name || '');
            setContact(selectedVoter.temp_voter_data_voter_contact_number?.toString() || '');
            setCaste(selectedVoter.temp_voter_data_voter_cast || null);
            setCurrentStatus(selectedVoter.temp_voter_data_voter_live_status || null);
            setMaritalStatus(selectedVoter.temp_voter_data_voter_marital_status || null);
            setGender(selectedVoter.temp_voter_data_voter_gender || null);
            setAge(selectedVoter.temp_voter_data_voter_age ? Number(selectedVoter.temp_voter_data_voter_age) : null);
        } else {
            setName('');
            setParentName('');
            setContact('');
            setCaste(null);
            setCurrentStatus(null);
            setMaritalStatus(null);
            setGender(null);
            setAge(null);
        }

        fetchCasteData();
    }, [selectedVoter]);


    const handleCloseEditForm = () => {
        resetFields()
        onClose()
    }

    const handleSubmit = async () => {
        setLoading(true);

        const updatedData = {
            ...(name && { temp_voter_data_voter_name: name }),
            ...(parentName && { temp_voter_data_voter_parent_name: parentName }),
            ...(contact && { temp_voter_data_voter_contact_number: contact }),
            ...(caste && { temp_voter_data_voter_cast: caste }),
            ...(age !== null && { temp_voter_data_voter_age: age }), // check for null explicitly
            ...(gender && { temp_voter_data_voter_gender: gender }),
            ...(currentStatus && { temp_voter_data_voter_live_status: currentStatus }),
            ...(maritalStatus && { temp_voter_data_voter_marital_status: maritalStatus }),
        };


        try {
            const apiUrl = `http://192.168.1.38:8000/api/update_voter_data/${selectedVoter.temp_voter_data_voter_id}/`;
            const response = await axios.put(apiUrl, updatedData);

            Alert.alert("Success", "Voter details updated successfully.");
        } catch (error) {
            Alert.alert("Error", "Failed to update voter details: " + error.message);
        } finally {
            setLoading(false);
            onEditVoter(selectedVoter.temp_voter_data_voter_id);
            handleCloseEditForm();
        }
    };


    const resetFields = () => {
        setName('');
        setParentName('');
        setContact('');
        setCaste(null);
        setCurrentStatus(null);
        setMaritalStatus(null);
        setGender(null);
        setAge(null);
    };


    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <Pressable style={styles.modalBackground} onPress={onClose}>

                {selectedVoter ?
                    <Pressable style={styles.modalContainer} onPress={Keyboard.dismiss}>
                        <View style={styles.header}>
                            <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold', textAlign: 'center' }}>Edit Voter Details</Text>
                        </View>

                        {selectedVoter.temp_voter_data_voter_age && <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder='Enter name here...'
                            style={styles.input}
                        />}

                        {selectedVoter.temp_voter_data_voter_parent_name && <TextInput
                            value={parentName}
                            onChangeText={setParentName}
                            placeholder='Enter parent name here...'
                            style={styles.input}
                        />}

                        {selectedVoter.temp_voter_data_voter_contact_number && <TextInput
                            value={contact}
                            onChangeText={setContact}
                            placeholder='Enter contact no. here...'
                            keyboardType='phone-pad'
                            style={styles.input}
                        />}

                        {selectedVoter.temp_voter_data_voter_cast && <DropDownPicker
                            open={openCaste}
                            value={caste}
                            items={casteOptions}
                            setOpen={setOpenCaste}
                            setValue={setCaste}
                            placeholder='Caste'
                            style={[styles.dropdown, { zIndex: 9999 }]}
                        />}

                        <View style={styles.row}>
                            <View style={styles.column}>
                                {selectedVoter.temp_voter_data_voter_live_status && <DropDownPicker
                                    open={openCurrentStatus}
                                    value={currentStatus}
                                    items={statusOptions}
                                    setOpen={setOpenCurrentStatus}
                                    setValue={setCurrentStatus}
                                    placeholder='Current Status'
                                    dropDownContainerStyle={{ zIndex: 999 }}
                                    style={[styles.dropdown, { zIndex: 999 }]}
                                />}
                                {selectedVoter.temp_voter_data_voter_age && <TextInput
                                    value={age ? age.toString() : ''}
                                    onChangeText={(text) => setAge(text ? Number(text) : null)}
                                    placeholder='Enter age here...'
                                    keyboardType='numeric'
                                    style={styles.input}
                                />}
                            </View>


                            <View style={styles.column}>
                                {selectedVoter.temp_voter_data_voter_marital_status &&
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
                                }

                                {selectedVoter.temp_voter_data_voter_gender &&
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
                                }
                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Pressable onPress={handleCloseEditForm} style={styles.cancelButton}>
                                <Text style={{ color: '#E54394', textAlign: 'center', paddingVertical: 10, fontSize: 17, fontWeight: '600' }}>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={handleSubmit} style={styles.submitButton}>
                                <Text style={{ color: 'white', textAlign: 'center', paddingVertical: 10, fontSize: 17, fontWeight: '600' }}>
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Text>
                            </Pressable>
                        </View>
                    </Pressable>
                    :
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size={'small'} color={'blue'} />
                        <Text>Loading...</Text>
                    </View>}
            </Pressable>
        </Modal >
    );
};

export default TempEditedVoterForm;

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
});
