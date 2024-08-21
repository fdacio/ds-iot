import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useNetInfoInstance } from "@react-native-community/netinfo";
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
    const { netInfo, refresh } = useNetInfoInstance();
    const [brokerMqtt, setBrokerMqtt] = useState('');
    const [brokerMqttPort, setBrokerMqttPort] = useState('');
    const [brokerMqttUser, setBrokerMqttUser] = useState('');
    const [brokerMqttPass, setBrokerMqttPass] = useState('');
    const [alertBrokerMqtt, setAlertBrokerMqtt] = useState();
    const [alertBrokerMqttPort, setAlertBrokerMqttPort] = useState();
    const [alertBrokerMqttUser, setAlertBrokerMqttUser] = useState();
    const [alertBrokerMqttPass, setAlertBrokerMqttPass] = useState();
    const [loading, setLoading] = useState(false);
    const defaultLabelBotao = "Connect";
    const [disabledButton, setDisabledButton] = useState(false);
    const [labelButton, setLabelButton] = useState(defaultLabelBotao);
    const headerRef = useRef();

    const _onSaveAndConnect = async () => {

        if (!_onValid()) return;

        setLoading(true);
        setLabelButton("Wait ...");
        setDisabledButton(true);

        try {
            await AsyncStorage.setItem("broker-mqtt", brokerMqtt);
            await AsyncStorage.setItem("broker-mqtt-port", brokerMqttPort);
            await AsyncStorage.setItem("broker-mqtt-user", brokerMqttUser);
            await AsyncStorage.setItem("broker-mqtt-pass", brokerMqttPass);
            if (!netInfo.isConnected) {
                Alert.alert(`${expo.name}`, "Check the internet connection");
                _updateSecreenPostSave();
                return;
            }
            mqttServiceProcessConnect(
                () => {
                    Alert.alert(`${expo.name}`, "Connection made successfully");
                    _updateSecreenPostSave();
                },
                (error) => {
                    console.log(error);
                    Alert.alert(`${expo.name}`, "Error connecting to MQTT Broker: " + error);
                    _updateSecreenPostSave();
                }
            );
        } catch (error) {
            console.log(error);
            Alert.alert(`${expo.name}`, "Error saving configuration");
            _updateSecreenPostSave();
        }

    }

    const _onValid = () => {

        _resetAlerts();

        let _isValid = true;

        if ((brokerMqtt == "") || (brokerMqtt == null) || (brokerMqtt == undefined)) {
            setAlertBrokerMqtt("Broker MQTT is required");
            _isValid = false;
        }
        if ((brokerMqttPort == "") || (brokerMqttPort == null) || (brokerMqttPort == undefined)) {
            setAlertBrokerMqttPort("Broker Port is required");
            _isValid = false;
        }
        if (Number(brokerMqttPort) > 9999) {
            setAlertBrokerMqttPort("Invalid Broker Port");
            _isValid = false;
        }
        if ((brokerMqttUser == "") || (brokerMqttUser == null) || (brokerMqttUser == undefined)) {
            setAlertBrokerMqttUser("Broker User is required");
            _isValid = false;
        }
        if ((brokerMqttPass == "") || (brokerMqttPass == null) || (brokerMqttPass == undefined)) {
            setAlertBrokerMqttPass("Broker Pass is required");
            _isValid = false;
        }

        return _isValid;
    }

    const _resetAlerts = () => {
        setAlertBrokerMqtt();
        setAlertBrokerMqttPort();
        setAlertBrokerMqttUser();
        setAlertBrokerMqttPass();
    }

    const _loadBrokerMqtt = async () => {

        _resetAlerts();

        let brokerMqtt = await AsyncStorage.getItem("broker-mqtt");
        if (brokerMqtt != null) {
            setBrokerMqtt(brokerMqtt);
        }

        let brokerMqttPort = await AsyncStorage.getItem("broker-mqtt-port");
        if (brokerMqttPort != null) {
            setBrokerMqttPort(brokerMqttPort);
        }

        let brokerMqttUser = await AsyncStorage.getItem("broker-mqtt-user");
        if (brokerMqttUser != null) {
            setBrokerMqttUser(brokerMqttUser);
        }

        let brokerMqttPass = await AsyncStorage.getItem("broker-mqtt-pass");
        if (brokerMqttPass != null) {
            setBrokerMqttPass(brokerMqttPass);
        }
    }

    const _updateSecreenPostSave = () => {
        setLoading(false);
        setLabelButton(defaultLabelBotao);
        setDisabledButton(false);
    }

    useEffect(() => {
        _loadBrokerMqtt();
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <Header ref={headerRef} showActionConnect={false} />
            <HeaderScreen defaultTitle="Settings" />
            <ScrollView>
                <View style={{ padding: 16, marginBottom: 48 }}>
                    <TextInputLabel label="Broker MQTT" onChangeText={text => setBrokerMqtt(text)} value={brokerMqtt} keyboardType="default" alert={alertBrokerMqtt} />
                    <TextInputLabel label="Broker MQTT Port" onChangeText={text => setBrokerMqttPort(text)} value={brokerMqttPort} keyboardType="numeric" alert={alertBrokerMqttPort} />
                    <TextInputLabel label="Broker MQTT User" onChangeText={text => setBrokerMqttUser(text)} value={brokerMqttUser} keyboardType="default" alert={alertBrokerMqttUser} />
                    <TextInputPasswordLabel label="Broker MQTT Pass" onChangeText={text => setBrokerMqttPass(text)} value={brokerMqttPass} keyboardType="default" alert={alertBrokerMqttPass} />
                    <Button label={labelButton} onPress={_onSaveAndConnect} disabled={disabledButton} />
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