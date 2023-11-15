import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Button = (props) => {

    return (
        <TouchableOpacity style={props.style || styles.button} onPress={props.onPress} disabled={props.disabled} >
            <Text style={styles.textButton}>{props.label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#201f1f',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },

    textButton: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        display: 'flex'
    },

    icon: {
        color: 'white'
    }

})

export default Button;