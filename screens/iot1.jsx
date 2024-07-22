import React from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, Text } from 'react-native';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Iot1 = () => {

    const stateLed = false;

    const _loadIpIot1 = async () => {
        let ipIot = await AsyncStorage.getItem('ip-iot-1');
        if (ipIot != null) {
            let ip = JSON.stringify(ipIot).replaceAll('"', '');
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

    return (
        <View style={styles.container}>
            <Header title="IOT 1" />
            <HeaderScreen title="Sala" />
            <View style={styles.contentIconsBulb}>
                {(stateLed) &&
                    <Icon name="lightbulb-o" size={100} color="#ffe000" />
                }
                {(!stateLed) &&
                    <Icon name="lightbulb-o" size={100} color="#c1c1c1" />
                }
            </View>
            <View style={styles.contentButtons}>
                <TouchableOpacity style={styles.buttons} title="ON"
                    onPress={_on} >
                    <Icon name="power-off" size={60} color="#006630" />
                    <Text style={styles.textButton}>ON</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons} title="OFF"
                    onPress={_off} >
                    <Icon name="power-off" size={60} color="#f00" />
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
    contentIconsBulb: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'flex-end',
    },
    contentButtons: {
        justifyContent: 'center',
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