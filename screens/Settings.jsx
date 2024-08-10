import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import TextInputLabel from '../components/TextInputLabel';
import TextInputPasswordLabel from '../components/TextInputPasswordLabel';
import Loading from '../components/Loading';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mqttServiceProcessConnect } from '../services/mqtt';
import { expo } from '../app.json';

const Settings = () => {

    const isFocused = useIsFocused();
    const [borkerMqtt, setBorkerMqtt] = useState('');
    const [borkerMqttPort, setBorkerMqttPort] = useState('');
    const [borkerMqttUser, setBorkerMqttUser] = useState('');
    const [borkerMqttPass, setBorkerMqttPass] = useState('');
    const [alertBorkerMqtt, setAlertBorkerMqtt] = useState();
    const [alertBorkerMqttPort, setAlertBorkerMqttPort] = useState();
    const [alertBorkerMqttUser, setAlertBorkerMqttUser] = useState();
    const [alertBorkerMqttPass, setAlertBorkerMqttPass] = useState();
    const [loading, setLoading] = useState(false);
    const defaultLabelBotao = "Connect";
    const [disabledButton, setDisabledButton] = useState(false);
    const [labelButton, setLabelButton] = useState(defaultLabelBotao);
    const headerRef = useRef();

    const _onSave = async () => {

        if (!_onValid()) return;

        setLoading(true);
        setLabelButton("Wait ...");
        setDisabledButton(true);

        try {
            await AsyncStorage.setItem("borker-mqtt", borkerMqtt);
            await AsyncStorage.setItem("borker-mqtt-port", borkerMqttPort);
            await AsyncStorage.setItem("borker-mqtt-user", borkerMqttUser);
            await AsyncStorage.setItem("borker-mqtt-pass", borkerMqttPass);
            mqttServiceProcessConnect(
                () => {
                    Alert.alert(`${expo.name}`, "Connection made successfully");
                    _updateSecreenPostSave();
                },
                (error) => {
                    console.log(error);
                    Alert.alert(`${expo.name}`, "Error connecting to MQTT Broker: " + error);
                    _updateSecreenPostSave();
                });
        } catch (error) {
            console.log(error);
            Alert.alert(`${expo.name}`, "Error saving configuration");
            _updateSecreenPostSave();
        }

    }

    const _onValid = () => {

        _resetAlerts();

        let _isValid = true;

        if ((borkerMqtt == "") || (borkerMqtt == null) || (borkerMqtt == undefined)) {
            setAlertBorkerMqtt("Borker MQTT is required");
            _isValid = false;
        }
        if ((borkerMqttPort == "") || (borkerMqttPort == null) || (borkerMqttPort == undefined)) {
            setAlertBorkerMqttPort("Borker Port is required");
            _isValid = false;
        }
        if (Number(borkerMqttPort) > 9999) {
            setAlertBorkerMqttPort("Invalid Borker Port");
            _isValid = false;
        }
        if ((borkerMqttUser == "") || (borkerMqttUser == null) || (borkerMqttUser == undefined)) {
            setAlertBorkerMqttUser("Borker User is required");
            _isValid = false;
        }
        if ((borkerMqttPass == "") || (borkerMqttPass == null) || (borkerMqttPass == undefined)) {
            setAlertBorkerMqttPass("Borker Pass is required");
            _isValid = false;
        }

        return _isValid;
    }

    const _resetAlerts = () => {
        setAlertBorkerMqtt();
        setAlertBorkerMqttPort();
        setAlertBorkerMqttUser();
        setAlertBorkerMqttPass();
    }

    const _loadBorkerMqtt = async () => {

        _resetAlerts();

        let borkerMqtt = await AsyncStorage.getItem("borker-mqtt");
        if (borkerMqtt != null) {
            setBorkerMqtt(borkerMqtt);
        }

        let borkerMqttPort = await AsyncStorage.getItem("borker-mqtt-port");
        if (borkerMqttPort != null) {
            setBorkerMqttPort(borkerMqttPort);
        }

        let borkerMqttUser = await AsyncStorage.getItem("borker-mqtt-user");
        if (borkerMqttUser != null) {
            setBorkerMqttUser(borkerMqttUser);
        }

        let borkerMqttPass = await AsyncStorage.getItem("borker-mqtt-pass");
        if (borkerMqttPass != null) {
            setBorkerMqttPass(borkerMqttPass);
        }
    }

    const _updateSecreenPostSave = () => {
        setLoading(false);
        setLabelButton(defaultLabelBotao);
        setDisabledButton(false);
    }

    useEffect(() => {
        _loadBorkerMqtt();
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <Header ref={headerRef} showActionConnect={false} />
            <HeaderScreen defaultTitle="Settings" />
            <ScrollView>
                <View style={{ padding: 16, marginBottom: 48 }}>
                    <TextInputLabel label="Broker MQTT" onChangeText={text => setBorkerMqtt(text)} value={borkerMqtt} keyboardType="default" alert={alertBorkerMqtt} />
                    <TextInputLabel label="Broker MQTT Port" onChangeText={text => setBorkerMqttPort(text)} value={borkerMqttPort} keyboardType="numeric" alert={alertBorkerMqttPort} />
                    <TextInputLabel label="Broker MQTT User" onChangeText={text => setBorkerMqttUser(text)} value={borkerMqttUser} keyboardType="default" alert={alertBorkerMqttUser} />
                    <TextInputPasswordLabel label="Broker MQTT Pass" onChangeText={text => setBorkerMqttPass(text)} value={borkerMqttPass} keyboardType="default" alert={alertBorkerMqttPass} />
                    <Button label={labelButton} onPress={_onSave} disabled={disabledButton} />
                </View>
                <Loading loading={loading} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Settings;