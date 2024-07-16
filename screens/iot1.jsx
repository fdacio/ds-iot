import React from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, Text } from 'react-native';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Iot1 = () => {

    const _loadIpIot1 = async () => {
        let ipIot = await AsyncStorage.getItem('ip-iot-1');
        if (ipIot != null) {
            let ip = JSON.stringify(ipIot).replaceAll('"','');
            return ip;
        } 
        return null;
    }

    const _on = async () => {
        let ip = await _loadIpIot1();
        if (ip == null) return;
        let url = 'http://' + ip + '/on';
        try {
            await fetch(url);
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    const _off = async () => {
        let ip = await _loadIpIot1();
        if (ip == null) return;
        let url = 'http://' + ip + '/off';
        try {
            await fetch(url);
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    // const getApiData = async () => {
    //     let url = 'http://159.203.24.33:8083/siga/macroprocesso/get-all-percentual';
    //     await fetch(url)
    //         .then((response) => {
    //             console.log(JSON.stringify(response))
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    // getApiData();

    return (
        <View style={styles.container}>
            <Header title="IOT 1"></Header>
            <View style={styles.contentButtons}>
                <TouchableOpacity style={styles.buttons} title="ON"
                    onPress={_on} > 
                    <Icon name="power-off" size = { 60 } color="#006630"/>      
                    <Text style={styles.textButton}>ON</Text>                
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons} title="OFF"
                    onPress={_off} > 
                    <Icon name="power-off" size={ 60 } color="#f00"/>
                    <Text style={styles.textButton}>OFF</Text> 
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentButtons: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    },
    
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

});

export default Iot1;