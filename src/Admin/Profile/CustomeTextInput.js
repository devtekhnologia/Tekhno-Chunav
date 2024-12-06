import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const CustomeTextInput = (props) => {
    return (
        <TextInput
            value={props.label + props.valueDetails}
            style={props.styles}
            readOnly={props.readValue}
        // placeholder={props.placeholder}
        />
    )
}

export default CustomeTextInput

const styles = StyleSheet.create({})