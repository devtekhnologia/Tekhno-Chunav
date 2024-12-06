import React from 'react';
import { Modal, View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
const { width, height } = Dimensions.get('window');

// A utility function to scale font sizes
const scaleFontSize = (size) => {
    const scale = width / 375; // Assuming 375 is the base width
    return Math.round(size * scale);
};
const CasteModal = ({
    visible,
    onClose,
    allCasts,
    newCaste,
    setNewCaste,
    assignCaste,
    language
}) => {
    const handleAssign = () => {
        if (newCaste) {
            assignCaste(newCaste);
            onClose();
        } else {
            Alert.alert('Warning', 'Please select a caste');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {language === 'en' ? 'Assign Caste' : 'जात नियुक्त करा'}
                    </Text>
                    <RNPickerSelect
                        onValueChange={(value) => setNewCaste(value)}
                        items={allCasts}
                        style={pickerSelectStyles}
                        value={newCaste}
                        placeholder={{
                            label: language === 'en' ? 'Select caste...' : 'जात निवडा...',
                            value: null,
                        }}
                    />
                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleAssign}
                        >
                            <Text style={styles.modalButtonText}>
                                {language === 'en' ? 'Assign' : 'नियुक्त करा'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={onClose}
                        >
                            <Text style={styles.modalButtonText}>
                                {language === 'en' ? 'Cancel' : 'रद्द करा'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CasteModal;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 15
    },





    // header 
    heading: {
        fontSize: scaleFontSize(24),
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },


    // search bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: width * 0.03,
        // marginHorizontal:width * 0.05, 
        backgroundColor: '#F5F5F5',
        marginVertical: '3%',
    },

    icon: {
        marginRight: width * 0.02,
    },

    searchInput: {
        flex: 1,
        fontSize: width * 0.04,
        color: '#333',
        paddingVertical: height * 0.01,
    },


    // assign color to multiple voter 
    colorCirclesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
    },
    greenCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'green',
        borderRadius: 15,
    },
    redCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'red',
        borderRadius: 15,
    },
    yellowCircle: {
        width: 20,
        height: 20,
        backgroundColor: '#ffd326',
        borderRadius: 15,
    },

    blueCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'blue',
        borderRadius: 15,
    },

    skyblueCircle: {
        width: 20,
        height: 20,
        backgroundColor: '#a3c6ff',
        borderRadius: 15,
    },

    blackCircle: {
        width: 20,
        height: 20,
        backgroundColor: 'black',
        borderRadius: 15,
    },


    // voter record card


    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        elevation: 7,
        marginVertical: '2%',
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    leftSection: {
        flex: 1,
    },
    indexAndIDContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indexBox: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'blue',
        width: '15%'
    },
    indexText: {
        color: 'blue',
        fontSize: 14,
        fontWeight: 'bold',
    },
    idText: {
        color: 'blue',
        fontSize: 16,
        fontWeight: 'bold',
    },
    name: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    details: {
        color: '#333',
        fontSize: 14,
        marginTop: 2,
    },
    rightSection: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 20,
    },
    editIcon: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    thumbIcon: {
        alignSelf: 'flex-end',
        marginTop: 20,
    },
    colorIndicator: {
        width: '1.5%',
        height: '90%',
        marginRight: '5%',
        borderTopStartRadius: 20,
        borderBottomStartRadius: 20
    },



    // edit voter information modal

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    closeCircle: {
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 25,
        height: 25,
        backgroundColor: 'black',
        borderRadius: 50,
    },
    modalInput: {
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
    modalInputt: {
        backgroundColor: '#fff',
        borderColor: '#E2E2E2',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 18,
        color: '#000',
        width: '45%',
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderColor: '#E2E2E2',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '100%',
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderColor: '#E2E2E2',
        marginBottom: 15,
    },
    dropdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        width: '100%',
        marginBottom: '3%',
        marginTop: '3%'
    },
    dropdownRoww: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        width: '100%',
        marginBottom: '3%',
    },
    rowItem: {
        width: '45%',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#ff69b4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderColor: '#ff69b4',
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
    },
    cancelButtonText: {
        color: '#ff69b4',
        fontSize: 16,
        fontWeight: 'bold',
    },





    // color modal



    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    colorLegendModalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    colorCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },


    // assign cast to multiple 

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    selectionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#8d93fc',
        padding: 5,
        borderRadius: 10,
        // marginHorizontal: 5,  
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const pickerSelectStyles = StyleSheet.create({
    casteDropdown: {
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#E2E2E2',
            borderRadius: 10,
            color: 'black',
            paddingRight: 30,
        },
    },
    statusDropdown: {
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            color: 'black',
            paddingRight: 30,
            width: '100%',
        },
    },
    maritalStatusDropdown: {
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 10,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            color: 'black',
            paddingRight: 30,
            width: '100%',
        },
    },
    ageDropdown: {

        inputAndroid: {
            fontSize: 16,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            color: 'black',
            paddingRight: 30,
            width: '100%',
            flex: 1,
        },
    },
    genderDropdown: {
        inputAndroid: {
            fontSize: 16,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            color: 'black',
            paddingRight: 30,
            width: '100%',
            flex: 1,
        },
    },
});