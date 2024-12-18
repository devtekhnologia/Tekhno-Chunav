import { Dimensions, Modal, StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable, Keyboard, Alert, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import ColorLegendModal from '../ReusableCompo/ColorLegendModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LanguageContext } from '../ContextApi/LanguageContext';

const { height, width } = Dimensions.get('screen');

const EditVoterForm = ({ isVisible, onClose, selectedVoter, onEditVoter }) => {
    const { language } = useContext(LanguageContext);
    const [name, setName] = useState('');
    const [name_mar, setName_mar] = useState('');
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
    const [filteredVoters, setFilteredVoters] = useState([]);
    const [openCaste, setOpenCaste] = useState(false);
    const [openCurrentStatus, setOpenCurrentStatus] = useState(false);
    const [openMaritalStatus, setOpenMaritalStatus] = useState(false);
    const [openGender, setOpenGender] = useState(false);
    const [selectedButtonId, setSelectedButtonId] = useState(null);
    const [location, setLocation] = useState('');
    const [color, setColor] = useState('black');
    const [modalVisible, setModalVisible] = useState(false);

    const statusOptions = [
        { label: language === 'en' ? 'Alive' : 'जीवित', value: 1 },
        { label: language === 'en' ? 'Dead' : 'मृत', value: 2 }
    ];
    const maritalOptions = [
        { label: language === 'en' ? 'Single' : 'अविवाहित', value: 1 },
        { label: language === 'en' ? 'Married' : 'विवाहित', value: 2 }
    ];
    const genderOptions = [
        { label: language === 'en' ? 'Male' : 'पुरुष', value: 'male' },
        { label: language === 'en' ? 'Female' : 'स्त्री', value: 'female' },
        { label: language === 'en' ? 'Other' : 'अन्य', value: 'other' },
    ];


    const handleSelectedVoterType = (item) => {
        console.log(item);

        setVoterFavourType(item.id);
        setTypeColor(item.id)

        const editedVoter = {
            "voter_id": selectedVoter.voter_id,
            "voter_name": name,
            "voter_name_mar": name_mar,
            "voter_favour_id": Number(item.id),
        }

        onEditVoter(editedVoter)

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
                Alert.alert('Success', 'Voter category updated successfully!');
            } else {
                throw new Error('Failed to update Voter category. Please try again.');
            }
        } catch (error) {
            console.error('Error updating Voter category:', error.message);
            Alert.alert('Error', 'Failed to update Voter category. Please try again.');
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
            Alert.alert('Error', 'Failed to load caste data');
        }
    };


    useEffect(() => {
        if (selectedVoter) {
            setName(selectedVoter.voter_name || '');
            setName_mar(selectedVoter.voter_name_mar || '');
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
            setTownName(language === 'en' ? selectedVoter.town_name : selectedVoter.town_name_mar || null)
            setBoothName(language === 'en' ? selectedVoter.booth_name : selectedVoter.booth_name_mar || null)
            setVoterFavourType(selectedVoter.voter_favour_id)
            setTypeColor(selectedVoter.voter_favour_id)
        } else {
            setName('');
            setName_mar('');
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
        resetFields()
        onClose()
    }

    const handlePdfIconClick = async (voterId) => {
        try {
            const response = await axios.get(`http://192.168.1.38:8000/api/generate_voter_pdf/${voterId}`, {
                params: { voter_id: voterId },
                responseType: 'arraybuffer', // Request the response as an array buffer
            });

            // Convert array buffer to base64 string
            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            // Get the file URI to save the PDF
            const fileUri = FileSystem.documentDirectory + `voter_${voterId}.pdf`;

            // Write the PDF to the file system
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            //Alert.alert('Success', 'PDF has been saved to your device!');

            // Share or open the PDF file
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to download the PDF.');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const editedVoter = {
            "voter_id": selectedVoter.voter_id,
            "voter_name": name,
            "voter_name_mar": name_mar,
            "voter_favour_id": voterFavourType,
        }

        // Dynamically updating only the fields that are changed
        let updatedFields = {};

        if (name !== '') updatedFields.voter_name = name;
        if (name !== '') updatedFields.voter_name_mar = name_mar;
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

        // If a field is empty, set it to null
        if (name === '') updatedFields.voter_name = null;
        if (parentName === '') updatedFields.voter_parent_name = null;
        if (contact === '') updatedFields.voter_contact_number = null;
        if (caste === '') updatedFields.voter_cast_id = null;
        if (age === '') updatedFields.voter_age = null;
        if (gender === '') updatedFields.voter_gender = null;
        if (currentStatus === '') updatedFields.voter_live_status_id = null;
        if (maritalStatus === '') updatedFields.voter_marital_status_id = null;
        if (voterFavourType === '') updatedFields.voter_favour_id = null;
        if (selectedButtonId === '') updatedFields.voter_in_city_id = null;
        if (location === '') updatedFields.voter_current_location = null;


        try {
            const apiUrl = `http://192.168.1.38:8000/api/voters/${selectedVoter.voter_id}/`;
            const response = await axios.patch(apiUrl, updatedFields);

        } catch (error) {
            Alert.alert("Error", "Failed to update voter details.");
        } finally {
            setLoading(false);
            onEditVoter(editedVoter)
            handleCloseEditForm()
            Alert.alert("Success", "Voter details updated successfully.");
        }
    };

    const resetFields = () => {
        setName('');
        setName_mar('');
        setParentName('');
        setContact('');
        setCaste(null);
        setCurrentStatus(null);
        setMaritalStatus(null);
        setGender(null);
        setVoterFavourType(null);
        setAge(null);
        setColor('black')
        // setUpdate(false)
    };


    const handleHexButtonClick = (id) => {
        setSelectedButtonId(id);
    };


    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <Pressable style={styles.modalBackground} onPress={onClose}>
                <Pressable style={styles.modalContainer} onPress={Keyboard.dismiss}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Text style={{ fontSize: 22, color: 'black', fontWeight: 'bold' }}>{language === 'en' ? "Edit Voter Details" : "मतदार माहिती भरा"}</Text>
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
                            placeholder='Enter voter name here...'
                            style={styles.input}
                        />

                        <TextInput
                            value={name_mar}
                            onChangeText={setName_mar}
                            placeholder={'येथे मतदार नाव प्रविष्ट करा...'}
                            style={styles.input}
                        />


                        <TextInput
                            value={parentName}
                            onChangeText={setParentName}
                            placeholder={language === 'en' ? 'Enter parent name here...' : 'येथे पालक / पती नाव प्रविष्ट करा...'}
                            style={styles.input}
                        />
                        <TextInput
                            value={contact}
                            onChangeText={setContact}
                            placeholder={language === 'en' ? 'Enter contact number here...' : 'येथे संपर्क क्रमांक प्रविष्ट करा...'}
                            keyboardType='phone-pad'
                            style={styles.input}
                        />

                        <DropDownPicker
                            open={openCaste}
                            value={caste}
                            items={casteOptions}
                            setOpen={setOpenCaste}
                            setValue={setCaste}
                            placeholder={language === 'en' ? 'Select Caste' : 'जात निवडा'}
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
                                    placeholder={language === 'en' ? 'Current Status' : 'वर्तमान स्थिति'}
                                    dropDownContainerStyle={{ zIndex: 999 }}
                                    style={[styles.dropdown, { zIndex: 999 }]}
                                />
                                <DropDownPicker
                                    open={openMaritalStatus}
                                    value={maritalStatus}
                                    items={maritalOptions}
                                    setOpen={setOpenMaritalStatus}
                                    setValue={setMaritalStatus}
                                    placeholder={language === 'en' ? 'Marital Status' : 'विवाहित स्थिति'}
                                    dropDownContainerStyle={{ zIndex: 899 }}
                                    style={[styles.dropdown, { zIndex: 899 }]}
                                />
                            </View>

                            <View style={styles.column}>
                                <TextInput
                                    value={age ? age.toString() : ''}
                                    onChangeText={(text) => setAge(text ? Number(text) : null)}
                                    placeholder={language === 'en' ? 'Enter age here...' : 'येथे वय प्रविष्ट करा'}
                                    keyboardType='numeric'
                                    style={styles.input}
                                />

                                <DropDownPicker
                                    open={openGender}
                                    value={gender}
                                    items={genderOptions}
                                    setOpen={setOpenGender}
                                    setValue={setGender}
                                    placeholder={language === 'en' ? 'Select Gender' : 'लिंग निवडा'}
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

                        <View>
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Town Name' : 'गाव/शहराचे नाव'}:</Text>
                                <Text style={styles.value}>{townName}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>{language === 'en' ? 'Booth Name' : 'बूथ नाव'}:</Text>
                                <Text style={styles.value}>{boothName}</Text>
                            </View>
                        </View>

                    </ScrollView>
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
            </Pressable>

            <ColorLegendModal
                isVisible={modalVisible}
                closeModal={handleCloseModal}
                onSelect={handleSelectedVoterType}
            />
        </Modal>
    );
};

export default EditVoterForm;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
    },
    modalContainer: {
        height: height * 0.9,
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
        // marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    dropdown: {
        marginVertical: 8,
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
    hexButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
        marginVertical: 10
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
        paddingVertical: 5,
        marginVertical: 10,
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
        // marginBottom: 8,
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
