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
let clientMqtt = null;
let brokenMqttHost;
let brokenMqttPort;
let brokenMqttUser;
let brokenMqttPass;
let brokenMqttTopicSubscribe;
let brokenMqttTopicPublish;

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
            clientMqtt = null;
        }

        return _client;

    }

    const hasClientMqtt = () => {

        if ((clientMqtt == null) || (clientMqtt == undefined) || (clientMqtt == '')) {
            return false;
        }

        return true;
    }

    useEffect(() => {

        if (isFocused) {

            loadMqttConfig().then((hasConfig) => {
                if (hasConfig) {
                    clientMqtt = connectMqtt();
                }
            });

        } else if (hasClientMqtt()) {
            Alert.alert("Debug", "Client MQTT Passou");
            /*
            if (clientMqtt.isConnected()) {
                clientMqtt.unsubscribe(brokenMqttTopicSubscribe);
                clientMqtt.disconnect();
            }
            */

        }

    }, [isFocused]);

    const _on = () => {

        if (hasClientMqtt()) {
            clientMqtt.send(brokenMqttTopicPublish, "on");
        }
    }

    const _off = () => {

        if (hasClientMqtt()) {
            clientMqtt.send(brokenMqttTopicPublish, "off");
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
