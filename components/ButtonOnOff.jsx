import React, { Fragment } from "react";
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ButtonOnOff = (props) => {

    return (
        <Fragment>
            {
                props.tipo == "on" &&
                <TouchableOpacity style={styles.buttons} title="ON"
                    onPress={props.action} >
                    <Icon name="power-off" size={60} color="#006630" />
                    <Text style={styles.textButton}>ON</Text>
                </TouchableOpacity>
            }
            {   
                props.tipo == "off" &&
                <TouchableOpacity style={styles.buttons} title="OFF"
                    onPress={props.action} >
                    <Icon name="power-off" size={60} color="#f00" />
                    <Text style={styles.textButton}>OFF</Text>
                </TouchableOpacity>
            }
        </Fragment>
    );
}

const styles = StyleSheet.create({

    buttons: {
        borderWidth: 2,
        borderColor: "#ccc",
        borderRadius: 500,
        width: 120,
        padding: 8,
        margin: 8,
        alignItems: 'center',
    },

    iconButton: {
        width: 60,
        height: 60
    },

    textButton: {
        fontSize: 24,
        fontWeight: 'bold'
    }
})

export default ButtonOnOff;