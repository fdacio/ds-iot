import React from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import ButtonOnOff from '../components/ButtonOnOff';
import IconBulb from '../components/IconBulb';

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

            <Header />

            <HeaderScreen title="Sala" />

            <View style={styles.contentIconsBulb}>

                <IconBulb state={stateLed} />
            </View>

            <View style={styles.contentButtons}>
                <ButtonOnOff tipo="on" action={_on} />
                <ButtonOnOff tipo="off" action={_off} />
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

});

export default Iot1;