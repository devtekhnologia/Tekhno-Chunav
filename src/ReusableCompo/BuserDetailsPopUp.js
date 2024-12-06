import { Modal, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const BuserDetailsPopUp = ({ isModalVisible, setIsModalVisible, selectedBuser }) => {
    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType='fade'
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {selectedBuser && (
                        <>
                            <Text style={styles.modalTitle}>Booth User Details</Text>
                            <View style={styles.detailsContainer}>
                                <Text style={styles.modalText}>Name: {selectedBuser[0].user_name}</Text>
                                <Text style={styles.modalText}>Phone No: {selectedBuser[0].user_phone}</Text>
                                <Text style={styles.modalText}>Town: {selectedBuser[0].town_names}</Text>
                                <Text style={styles.modalText}>Booth: {selectedBuser[0].booth_names}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

export default BuserDetailsPopUp;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        height: '100%',
        maxWidth: 350,
        maxHeight: 450,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    detailsContainer: {
        alignItems: 'flex-start',
        width: '100%',
        justifyContent: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    closeButton: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'black',
        borderRadius: 5,
        alignItems: 'center'
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
