import React, { useContext } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { LanguageContext } from '../ContextApi/LanguageContext';


const ColorLegendModal = ({ isVisible, closeModal, onSelect }) => {
    const { language } = useContext(LanguageContext)

    const legendData = [
        { id: '0', color: '#000000', label: language === 'en' ? 'Pending' : 'बाकी' },
        { id: '1', color: '#188357', label: language === 'en' ? 'Favourable' : 'समर्थक' },
        { id: '2', color: '#FF3030', label: language === 'en' ? 'Against' : 'विरुद्ध' },
        { id: '3', color: '#FBBE17', label: language === 'en' ? 'Doubted' : 'संशयास्पद' },
        { id: '5', color: 'skyblue', label: language === 'en' ? 'Pro' : 'प्रो' },
        { id: '4', color: '#0284f5', label: language === 'en' ? 'Pro Plus' : 'प्रो+' },
        { id: '6', color: 'pink', label: language === 'en' ? 'No vote' : 'नो वोट' },
        {
            id: '7', color: 'purple', label: language === 'en' ? 'No vote Voted' : 'नो वोट वोटेड '
        }
    ];
    
    return (
        <>
            <StatusBar backgroundColor={isVisible ? 'rgba(0, 0, 0, 0.3)' : 'transparent'} />
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={closeModal}
            >
                <Pressable style={styles.overlay} onPress={closeModal}>
                    <BlurView intensity={70} tint='systemThickMaterial' style={styles.modalOverlay}>
                        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                            {legendData.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.legendItem}
                                    onPress={() => {
                                        onSelect(item)
                                        closeModal()
                                    }}>
                                    <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                                    <Text style={styles.label}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </Pressable>
                    </BlurView>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        paddingVertical: 40,
        paddingHorizontal: 50,
        backgroundColor: 'white',
        elevation: 10,
        borderRadius: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 30,
        marginBottom: 10,
        marginVertical: 20
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 15,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ColorLegendModal;
