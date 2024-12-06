import React from 'react';
import { View, Text, Button, Linking, Alert, StyleSheet } from 'react-native';

const SendWhatsAppMessage = () => {
    const [phoneNumbers, setPhoneNumbers] = useState('');
    const [templateName, setTemplateName] = useState('hello_world');

    const sendWhatsAppMessage = async () => {
        const numbersArray = phoneNumbers.split(',').map(number => number.trim());

        try {
            const response = await axios.post('http://localhost:5000/send-whatsapp-message', {
                to: numbersArray,
                template_name: templateName,
                language_code: 'en_US'
            });

            const { results } = response.data;
            const successMessages = results.filter(result => result.status === 'success');
            const errorMessages = results.filter(result => result.status === 'error');

            if (successMessages.length > 0) {
                Alert.alert('Success', `${successMessages.length} messages sent successfully!`);
            }

            if (errorMessages.length > 0) {
                Alert.alert('Error', `${errorMessages.length} messages failed to send.`);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to send messages. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Send WhatsApp Message</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter phone numbers separated by commas"
                value={phoneNumbers}
                onChangeText={setPhoneNumbers}
                keyboardType="default"
            />
            <Button title="Send Messages" onPress={sendWhatsAppMessage} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '80%',
    },
});

export default SendWhatsAppMessage;