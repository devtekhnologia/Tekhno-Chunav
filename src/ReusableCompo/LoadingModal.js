import { Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, Pressable, Alert, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('window');

const LoadingModal = ({ isModalVisible, setIsModalVisible, selectedVoter }) => {

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.loadingDetailsContainer}>
                    <ActivityIndicator size={'large'} color={'white'} />
                    <Text style={{ color: 'white', fontSize: 18 }}>Loading...</Text>
                </View>
            </View>
        </Modal >
    );
};

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.modalText}>{label}:</Text>
        <Text style={styles.modalText}>{value}</Text>
    </View>
);

export default LoadingModal;


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    loadingDetailsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});