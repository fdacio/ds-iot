import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

const TextInputLabel = (props) => {

    return (
        <View style={styles.content}>
            <Text style={styles.textLabel}>{props.label}</Text>
            <TextInput style={styles.textInput} onChangeText={props.onChangeText} value={props.value} autoCapitalize={props.autoCapitalize} inputMode={props.inputMode} autoComplete={props.autoComplete} keyboardType={props.keyboardType} autoCorrect={props.autoCorrect}/>
            <Text style={styles.textAlert}>{props.alert}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        marginBottom: 0,
    },

    textLabel: {
        fontSize: 18,
        marginBottom: 0
    },

    textInput: {
        borderColor: '#000',
        borderWidth: 1,
        width: '100%',
        height: 48,
        padding: 8,
        fontSize: 18,
        borderRadius: 4
    },

    textAlert: {
        fontSize: 14,
        color: 'red'
    }

})

export default TextInputLabel;