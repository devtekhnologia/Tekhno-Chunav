import { Dimensions, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, Button } from 'react-native';
import React, { useContext, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { LanguageContext } from './LanguageContext';

const { height } = Dimensions.get('screen');
const topMargin = height * 0.1;

export default function Help() {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const accordionData = [
    { question: 'What is Tekhno Chunav?', answer: 'Tekhno Chunav is a Election Management System.' },
    { question: 'How can I contact support?', answer: 'You can contact support through email or phone.' },
    // { question: 'Where is your office located?', answer: 'Our office is located in XYZ city, ABC street.' },
    { question: 'Do you offer online services?', answer: 'Yes, we provide online services for our clients.' },
    // { question: 'What are your working hours?', answer: 'Our working hours are from 9 AM to 6 PM, Monday to Friday.' },
  ];

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3C4CAC', '#F04393']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0.1, 1]}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.bigText}>
            {language === 'en' ? 'FREQUENTLY ASKED QUESTIONS' : 'वारंवार विचारले जाणारे प्रश्न'}
          </Text>
          <Text style={styles.text}>
            {language === 'en' ? 'Find answers to common questions below' : 'खालील सामान्य प्रश्नांची उत्तरे शोधा'}
          </Text>
        </View>

        <View style={styles.bottomView}>


          <ScrollView>
            {accordionData.map((item, index) => (
              <View key={index} style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleAccordion(index)}
                >
                  <Text style={styles.questionText}>{language === 'en' ? item.question : translateToMarathi(item.question)}</Text>
                </TouchableOpacity>
                {expandedIndex === index && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.answerText}>{language === 'en' ? item.answer : translateToMarathi(item.answer)}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Example translation function
const translateToMarathi = (text) => {
  const translations = {
    'What is Tekhno Chunav?': 'Tekhno Chunav म्हणजे काय?',
    'Tekhno Chunav is a Election Management System.': 'Tekhno Chunav ही निवडणूक व्यवस्थापन प्रणाली आहे.',
    'How can I contact support?': 'मी सपोर्टशी कसे संपर्क करू शकतो?',
    'You can contact support through email or phone.': 'तुम्ही ईमेल किंवा फोनद्वारे सपोर्टशी संपर्क साधू शकता.',
    'Where is your office located?': 'तुमचे ऑफिस कुठे आहे?',
    'Our office is located in XYZ city, ABC street.': 'आमचे कार्यालय XYZ शहरात, ABC रस्त्यावर आहे.',
    'Do you offer online services?': 'तुम्ही ऑनलाइन सेवा देता का?',
    'Yes, we provide online services for our clients.': 'होय, आम्ही आमच्या ग्राहकांसाठी ऑनलाइन सेवा देतो.',
    'What are your working hours?': 'तुमचे कामाचे तास काय आहेत?',
    'Our working hours are from 9 AM to 6 PM, Monday to Friday.': 'आमचे कामाचे तास सोमवार ते शुक्रवार सकाळी 9 ते संध्याकाळी 6 पर्यंत आहेत.'
  };
  return translations[text] || text;
};






const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 0.45,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    height: height * 0.325,
    alignItems: 'center',
    marginTop: topMargin,
  },
  bigText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  bottomView: {
    width: '100%',
    height: height * 0.7,
    padding: 20,
    backgroundColor: 'white',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  accordionItem: {
    marginBottom: 10,
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C4CAC',
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  answerText: {
    fontSize: 14,
    color: '#333',
  },
});
