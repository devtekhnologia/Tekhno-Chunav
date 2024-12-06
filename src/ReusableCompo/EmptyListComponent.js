import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '../ContextApi/LanguageContext'

const EmptyListComponent = () => {
    const { language } = useContext(LanguageContext);
    return (
        <Text style={styles.noDataText}>
            {language === 'en' ? 'No results found' : 'कोणतेही परिणाम आढळले नाहीत'}
        </Text>
    )
}

export default EmptyListComponent

const styles = StyleSheet.create({
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
    },
})