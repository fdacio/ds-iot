import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Paho from "paho-mqtt";
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import ButtonOnOff from '../components/ButtonOnOff';
import IconBulb from '../components/IconBulb';

//Variáveis de uso global
var clientMqttDSIOT = null;
var brokenMqttHost = null;
var brokenMqttPort = null;
var brokenMqttUser = null;
var brokenMqttPass = null;
var brokenMqttTopicSubscribe = null;
var brokenMqttTopicPublish = null;

const Mqtt = () => {

    const isFocused = useIsFocused();
    const [stateLed, setStateLed] = useState(false);

    const loadMqttConfig = async () => {

        brokenMqttHost = await AsyncStorage.getItem("broken-mqtt");
        brokenMqttPort = await AsyncStorage.getItem("broken-mqtt-port");
        brokenMqttUser = await AsyncStorage.getItem("broken-mqtt-user");
        brokenMqttPass = await AsyncStorage.getItem("broken-mqtt-pass");
        brokenMqttTopicSubscribe = await AsyncStorage.getItem("broken-mqtt-topic-subscribe");
        brokenMqttTopicPublish = await AsyncStorage.getItem("broken-mqtt-topic-publish");

        if ((brokenMqttHost == null) || (brokenMqttPort == null) || (brokenMqttUser == null) || (brokenMqttPass == null)) {
            return false;
        }

        return true;

    }

    const connectMqtt = () => {

        let host = brokenMqttHost;
        let port = parseInt(brokenMqttPort);
        let clientId = `mqtt-dsiot-${parseInt(Math.random() * 100000)}`;

        let _client = new Paho.Client(
            host,
            port,
            clientId
        );

        const options = {
            userName: brokenMqttUser,
            password: brokenMqttPass,
            mqttVersion: 3,
            onSuccess: async () => {
                console.log("Conectado com sucesso!");
                if (brokenMqttTopicSubscribe == null) return;
                _client.subscribe(brokenMqttTopicSubscribe);
                _client.onMessageArrived = (message) => {
                    if (message.destinationName === brokenMqttTopicSubscribe) {
                        if (message.payloadString == "on") {
                            setStateLed(true);
                        } else if (message.payloadString == "off") {
                            setStateLed(false);
                        }
                    }
                }
            },
            onFailure: (err) => {
                Alert.alert("MQTT", "Conexão Falhou: Ver configurações em Settings");
                return null;
            }
        };

        _client.connect(options);

        _client.onConnectionLost = () => {
            console.log("Disconetado!");
            clientMqttDSIOT = null;
        }

        return _client;

    }

    const hasClientMqtt = () => {
        if ((clientMqttDSIOT == null) || (clientMqttDSIOT == undefined)) {
            return false;
        }
        return true;
    }

    const hasTopicSubscribe = () => {
        if ((brokenMqttTopicSubscribe == null) || (brokenMqttTopicSubscribe == undefined)) {
            return false;
        }
        return true;
    }

    const hasTopicPublish = () => {
        if ((brokenMqttTopicPublish == null) || (brokenMqttTopicPublish == undefined)) {
            return false;
        }
        return true;
    }

    useEffect(() => {

        if (isFocused) {

            loadMqttConfig().then((hasConfig) => {
                if (hasConfig) {
                    clientMqttDSIOT = connectMqtt();
                }
            });

        } else if (hasClientMqtt()) {
            if (clientMqttDSIOT.isConnected()) {
                if (hasTopicSubscribe()) {
                    clientMqttDSIOT.unsubscribe(brokenMqttTopicSubscribe);
                }
                clientMqttDSIOT.disconnect();
            }
        }

    }, [isFocused]);

    const _on = () => {

        if (hasClientMqtt() && hasTopicPublish()) {
            clientMqttDSIOT.send(brokenMqttTopicPublish, "on");
        }
    }

    const _off = () => {

        if (hasClientMqtt() && hasTopicPublish()) {
            clientMqttDSIOT.send(brokenMqttTopicPublish, "off");
        }
    }

    return (
        <View style={styles.container}>

            <Header />

            <HeaderScreen title="Cozinha" />

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
    }

});

export default Mqtt;
