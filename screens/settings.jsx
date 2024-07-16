import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import Header from '../components/Header';
import TextInputLabel from '../components/TextInputLabel';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {

    const [ipIot1, setIpIot1] = useState('');
    const [ipIot2, setIpIot2] = useState('');
    const [brokenMqtt, setBrokenMqtt] = useState('');
    const [brokenMqttPort, setBrokenMqttPort] = useState('');
    const [brokenMqttUser, setBrokenMqttUser] = useState('');
    const [brokenMqttPass, setBrokenMqttPass] = useState('');
    const [brokenMqttTopicSubscribe, setBrokenMqttTopicSubscribe] = useState('');
    const [brokenMqttTopicPublish, setBrokenMqttTopicPublish] = useState('');

    const _onSave = async () => {
        try {
            await AsyncStorage.setItem("ip-iot-1", ipIot1);
            await AsyncStorage.setItem("ip-iot-2", ipIot2);
            await AsyncStorage.setItem("broken-mqtt", brokenMqtt);
            await AsyncStorage.setItem("broken-mqtt-port", brokenMqttPort);
            await AsyncStorage.setItem("broken-mqtt-user", brokenMqttUser);
            await AsyncStorage.setItem("broken-mqtt-pass", brokenMqttPass);
            await AsyncStorage.setItem("broken-mqtt-topic-subscribe", brokenMqttTopicSubscribe);
            await AsyncStorage.setItem("broken-mqtt-topic-publish", brokenMqttTopicPublish);
            Alert.alert("DS-IOT", "Configuração salva com sucesso");
        } catch (error) {
            console.log(error);
            Alert.alert("DS-IOT", "Erro ao salvar configuração");
        }
    }

    const _loadIpIot1 = async () => {
        let ipIot1 = await AsyncStorage.getItem('ip-iot-1');
        if (ipIot1 != null) {
            setIpIot1(ipIot1);
        }
    }

    const _loadIpIot2 = async () => {
        let ipIot2 = await AsyncStorage.getItem('ip-iot-2');
        if (ipIot2 != null) {
            setIpIot2(ipIot2);
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
        
        let brokenMqttTopicSubscribe = await AsyncStorage.getItem("broken-mqtt-topic-subscribe");
        if (brokenMqttTopicSubscribe != null) {
            setBrokenMqttTopicSubscribe(brokenMqttTopicSubscribe);
        }

        let brokenMqttTopicPublish = await AsyncStorage.getItem("broken-mqtt-topic-publish");
        if (brokenMqttTopicPublish != null) {
            setBrokenMqttTopicPublish(brokenMqttTopicPublish);
        }
    }

    useEffect(() => {
        _loadIpIot1();
        _loadIpIot2();
        _loadBrokenMqtt();
    }, []);

    return (
        <View style={styles.container}>
            <Header title="Settings" />
            <ScrollView>
                <View style={{ padding: 16, marginBottom: 48 }}>
                    <TextInputLabel label="IP IOT 1" onChangeText={text => setIpIot1(text)} value={ipIot1} keyboardType="default"/>
                    <TextInputLabel label="IP IOT 2" onChangeText={text => setIpIot2(text)} value={ipIot2} keyboardType="default"/>
                    <TextInputLabel label="Broken MQTT" onChangeText={text => setBrokenMqtt(text)} value={brokenMqtt} keyboardType="default" />    
                    <TextInputLabel label="Broken MQTT Port" onChangeText={text => setBrokenMqttPort(text)} value={brokenMqttPort} keyboardType="default" />    
                    <TextInputLabel label="Broken MQTT User" onChangeText={text => setBrokenMqttUser(text)} value={brokenMqttUser} keyboardType="default" />    
                    <TextInputLabel label="Broken MQTT Pass" onChangeText={text => setBrokenMqttPass(text)} value={brokenMqttPass} keyboardType="default" />    
                    <TextInputLabel label="Broken MQTT Topic Subscribe" onChangeText={text => setBrokenMqttTopicSubscribe(text)} value={brokenMqttTopicSubscribe} keyboardType="default" />    
                    <TextInputLabel label="Broken MQTT Topic Publish" onChangeText={text => setBrokenMqttTopicPublish(text)} value={brokenMqttTopicPublish} keyboardType="default" />    
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