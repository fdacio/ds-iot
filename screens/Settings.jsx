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
    const [brokenMqtt, setBrokenMqtt] = useState('');
    const [brokenMqttPort, setBrokenMqttPort] = useState('');
    const [brokenMqttUser, setBrokenMqttUser] = useState('');
    const [brokenMqttPass, setBrokenMqttPass] = useState('');
    const [alertBrokenMqtt, setAlertBrokenMqtt] = useState();
    const [alertBrokenMqttPort, setAlertBrokenMqttPort] = useState();
    const [alertBrokenMqttUser, setAlertBrokenMqttUser] = useState();
    const [alertBrokenMqttPass, setAlertBrokenMqttPass] = useState();
    const [loading, setLoading] = useState(false);
    const defaultLabelBotao = "Conectar";
    const [disabledButton, setDisabledButton] = useState(false);
    const [labelButton, setLabelButton] = useState(defaultLabelBotao);
    const headerRef = useRef();

    const _onSave = async () => {

        if (!_onValid()) return;

        setLoading(true);
        setLabelButton("Aguarde ...");
        setDisabledButton(true);

        try {
            await AsyncStorage.setItem("broken-mqtt", brokenMqtt);
            await AsyncStorage.setItem("broken-mqtt-port", brokenMqttPort);
            await AsyncStorage.setItem("broken-mqtt-user", brokenMqttUser);
            await AsyncStorage.setItem("broken-mqtt-pass", brokenMqttPass);
            mqttServiceProcessConnect(
                () => {
                    Alert.alert(`${expo.name}`, "Conexão realizada com sucesso");
                    _updateSecreenPostSave();
                },
                (error) => {
                    console.log(error);
                    Alert.alert(`${expo.name}`, "Erro ao conectar com Broken MQTT: " + error);
                    _updateSecreenPostSave();
                });
        } catch (error) {
            console.log(error);
            Alert.alert(`${expo.name}`, "Erro ao salvar configuração");
            _updateSecreenPostSave();
        }

    }

    const _onValid = () => {

        _resetAlerts();

        let _isValid = true;

        if ((brokenMqtt == "") || (brokenMqtt == null) || (brokenMqtt == undefined)) {
            setAlertBrokenMqtt("Broken MQTT is required");
            _isValid = false;
        }
        if ((brokenMqttPort == "") || (brokenMqttPort == null) || (brokenMqttPort == undefined)) {
            setAlertBrokenMqttPort("Broken Port is required");
            _isValid = false;
        }
        if (Number(brokenMqttPort) > 9999) {
            setAlertBrokenMqttPort("Invalid Broken Port");
            _isValid = false;
        }
        if ((brokenMqttUser == "") || (brokenMqttUser == null) || (brokenMqttUser == undefined)) {
            setAlertBrokenMqttUser("Broken User is required");
            _isValid = false;
        }
        if ((brokenMqttPass == "") || (brokenMqttPass == null) || (brokenMqttPass == undefined)) {
            setAlertBrokenMqttPass("Broken Pass is required");
            _isValid = false;
        }

        return _isValid;
    }

    const _resetAlerts = () => {
        setAlertBrokenMqtt();
        setAlertBrokenMqttPort();
        setAlertBrokenMqttUser();
        setAlertBrokenMqttPass();
    }

    const _loadBrokenMqtt = async () => {

        _resetAlerts();

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

    const _updateSecreenPostSave = () => {
        setLoading(false);
        setLabelButton(defaultLabelBotao);
        setDisabledButton(false);
    }

    useEffect(() => {
        _loadBrokenMqtt();
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <Header ref={headerRef} showActionConnect={false} />
            <HeaderScreen defaultTitle="Settings" />
            <ScrollView>
                <View style={{ padding: 16, marginBottom: 48 }}>
                    <TextInputLabel label="Broken MQTT" onChangeText={text => setBrokenMqtt(text)} value={brokenMqtt} keyboardType="default" alert={alertBrokenMqtt} />
                    <TextInputLabel label="Broken MQTT Port" onChangeText={text => setBrokenMqttPort(text)} value={brokenMqttPort} keyboardType="numeric" alert={alertBrokenMqttPort} />
                    <TextInputLabel label="Broken MQTT User" onChangeText={text => setBrokenMqttUser(text)} value={brokenMqttUser} keyboardType="default" alert={alertBrokenMqttUser} />
                    <TextInputPasswordLabel label="Broken MQTT Pass" onChangeText={text => setBrokenMqttPass(text)} value={brokenMqttPass} keyboardType="default" alert={alertBrokenMqttPass} />
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