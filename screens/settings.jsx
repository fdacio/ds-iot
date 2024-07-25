import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import TextInputLabel from '../components/TextInputLabel';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {

    const [brokenMqtt, setBrokenMqtt] = useState('');
    const [brokenMqttPort, setBrokenMqttPort] = useState('');
    const [brokenMqttUser, setBrokenMqttUser] = useState('');
    const [brokenMqttPass, setBrokenMqttPass] = useState('');


    const _onSave = async () => {
        try {
            await AsyncStorage.setItem("ip-iot-1", ipIot1);
            await AsyncStorage.setItem("ip-iot-2", ipIot2);
            await AsyncStorage.setItem("broken-mqtt", brokenMqtt);
            await AsyncStorage.setItem("broken-mqtt-port", brokenMqttPort);
            await AsyncStorage.setItem("broken-mqtt-user", brokenMqttUser);
            await AsyncStorage.setItem("broken-mqtt-pass", brokenMqttPass);
            Alert.alert("DS-IOT", "Configuração salva com sucesso");
        } catch (error) {
            console.log(error);
            Alert.alert("DS-IOT", "Erro ao salvar configuração");
        }
    }


    const _loadBrokenMqtt = async () => {

        let brokenMqtt = await AsyncStorage.getItem("broken-mqtt");
        if (brokenMqtt != null) {
            setBrokenMqtt(brokenMqtt);
        }

        let brokenMqttPort = await AsyncStorage.getItem("broken-mqtt-port");
        if (brokenMqttPort != null) {
            setBrokenMqttPort(brokenMqttPort);
        }

        let brokenMqttUser = await AsyncStorage.getItem("broken-mqtt-user");
        if (brokenMqttUser != null) {
            setBrokenMqttUser(brokenMqttUser);
        }

        let brokenMqttPass = await AsyncStorage.getItem("broken-mqtt-pass");
        if (brokenMqttPass != null) {
            setBrokenMqttPass(brokenMqttPass);
        }
    }

    useEffect(() => {
        _loadBrokenMqtt();

    }, []);

    return (
        <View style={styles.container}>
            <Header/>
            <HeaderScreen  defaultTitle="Settings" />
            <ScrollView>
                <View style={{ padding: 16, marginBottom: 48 }}>
                    <TextInputLabel label="Broken MQTT" onChangeText={text => setBrokenMqtt(text)} value={brokenMqtt} keyboardType="default" />    
                    <TextInputLabel label="Broken MQTT Port" onChangeText={text => setBrokenMqttPort(text)} value={brokenMqttPort} keyboardType="default" />    
                    <TextInputLabel label="Broken MQTT User" onChangeText={text => setBrokenMqttUser(text)} value={brokenMqttUser} keyboardType="default" />    
                    <TextInputLabel label="Broken MQTT Pass" onChangeText={text => setBrokenMqttPass(text)} value={brokenMqttPass} keyboardType="default" />    
                    <Button label="Salvar" onPress={_onSave} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Settings;