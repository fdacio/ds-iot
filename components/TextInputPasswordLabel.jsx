import React, { Fragment, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TextInputPasswordLabel = (props) => {

    const [focus, setFocus] = useState(false);
    const [secure, setSecure] = useState(true);


    return (
        <View style={styles.content}>
            <Text style={styles.textLabel}>{props.label}</Text>
            <View style={styles.contentInput}>
                <TextInput style={styles.textInput} onChangeText={props.onChangeText} value={props.value} inputMode={props.inputMode} keyboardType={props.keyboardType} secureTextEntry={secure}  setFocus={focus} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}/>
                <Pressable style={styles.pressableIcon} onPress={() => setSecure(!secure)} >
                    <Icon name={secure ? 'eye' : 'eye-slash'} size={24} color="#000" style={styles.selectIcon} />
                </Pressable>
            </View>
            {(props.alert!= undefined) && 
            <Text style={styles.textAlert}>{props.alert}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        flex: 1,
        marginBottom: 8,
    },

    textLabel: {
        fontSize: 18,
        marginBottom: 0
    },

    textInput: {
        flex: 2,
        borderColor: '#000',
        borderWidth: 1,
        width: '90%',
        height: 48,
        padding: 8,
        fontSize: 18,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    
    pressableIcon :{
        height: 48,
        width: 50,
        borderTopRightRadius: 4,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        borderBottomRightRadius: 4,
        backgroundColor: '#ccc',
        alignItems: 'center',
        alignContent: 'center',
        padding: 10,
    },

    contentInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    selectIcon: {
        display: 'flex',
        alignSelf: 'center',
    },

    textAlert: {
        fontSize: 14,
        color: 'red',
    },



})

export default TextInputPasswordLabel;