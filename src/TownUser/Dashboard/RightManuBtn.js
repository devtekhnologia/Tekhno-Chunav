import React, { useState, useRef, useEffect, useContext } from 'react';
import { Dimensions, Modal, TouchableOpacity, StyleSheet, Text, View, TouchableWithoutFeedback, Animated } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { LanguageContext } from '../../ContextApi/LanguageContext';
const { height, width } = Dimensions.get('screen');

const RightMenuBtn = () => {
    const navigation = useNavigation();
    const [isPressed, setPressed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-height * 0.2)).current;
    const { language } = useContext(LanguageContext);

    const handleToggleAppStore = () => {
        setPressed(!isPressed);
        setModalVisible(!modalVisible);
    };

    const handleNavigation = (travelTo) => {
        navigation.navigate(travelTo);
        closeModal();
    };

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: -height * 0.2,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            handleToggleAppStore()
            setModalVisible(false);
        });
    };

    useEffect(() => {
        if (modalVisible) {
            slideAnim.setValue(-height * 0.2);
            Animated.timing(slideAnim, {
                toValue: 50,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [modalVisible]);

    return (
        <>
            <TouchableOpacity onPress={handleToggleAppStore} accessibilityLabel="Toggle App Store Menu">
                <AntDesign
                    name={isPressed ? "appstore1" : "appstore-o"}
                    size={25}
                    color="black"
                />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalContainer}>
                        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                            <TouchableOpacity
                                onPress={() => { handleNavigation('Registeration') }}
                                style={styles.modalOption}
                                accessibilityLabel="Go to Registration"
                            >
                                <View style={{ width: 40, alignItems: 'center' }}>
                                    <AntDesign name="adduser" size={25} color="black" />
                                </View>
                                <Text style={styles.modalText}>{language === 'en' ? 'Booth User Register' : 'बूथ कार्यकर्ता नोंदणी'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { handleNavigation('Castwise Voters') }}
                                style={styles.modalOption}
                                accessibilityLabel="Go to Castwise Voters"
                            >
                                <View style={{ width: 40, alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="account-filter-outline" size={30} color="black" />
                                </View>
                                <Text style={styles.modalText}>{language === 'en' ? 'Castwise Voters' : 'जातीनिहाय मतदार'}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.0)',
    },
    modalContent: {
        width: 200,
        // height: height * 0.2,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        position: 'absolute',
        top: 0,
        right: 20,
        elevation: 5,
    },
    modalOption: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-evenly',
        columnGap: width * 0.02,
    },
    modalText: {
        fontSize: 18,
    },
});

export default RightMenuBtn;
