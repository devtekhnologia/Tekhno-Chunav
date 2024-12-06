import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '../ContextApi/LanguageContext'

const LoadingListComponent = () => {
    const { language } = useContext(LanguageContext);
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={'black'} />
            <Text>
                {language === 'en' ? 'Loading...' : 'लोड करत आहे...'}
            </Text>
        </View>
    )
}

export default LoadingListComponent

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
})