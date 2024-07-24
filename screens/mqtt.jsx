import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Paho from "paho-mqtt";

//Variáveis de uso global
let clientMqtt;
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

        let clientMqtt = new Paho.Client(
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
                clientMqtt.subscribe(brokenMqttTopicSubscribe);
                clientMqtt.onMessageArrived = (message) => {
                    if (message.destinationName === brokenMqttTopicSubscribe) {
                        //console.log(message.payloadString);
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

        clientMqtt.connect(options);

        clientMqtt.onConnectionLost = () => {
            console.log("Disconetado!");
        }

        return clientMqtt;

    }

    useEffect(() => {

        if (isFocused) {
            loadMqttConfig().then((hasConfig) => {
                if (hasConfig) {
                    clientMqtt = connectMqtt();
                }
            });

        } else {

            if (clientMqtt == null || clientMqtt == undefined) return;

            if (clientMqtt.isConnected()) {
                clientMqtt.unsubscribe(brokenMqttTopicSubscribe);
                clientMqtt.disconnect();
            }
        }

    }, [isFocused]);

    const _on = () => {

        if (clientMqtt == null || clientMqtt == undefined) return;
        if (brokenMqttTopicPublish == null) return;

        clientMqtt.send(brokenMqttTopicPublish, "on");
    }

    const _off = () => {

        if (clientMqtt == null || clientMqtt == undefined) return;
        if (brokenMqttTopicPublish == null) return;

        clientMqtt.send(brokenMqttTopicPublish, "off");
    }

    return (
        <View style={styles.container}>
            <Header title="MQTT" />
            <HeaderScreen title="Cozinha" />
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

export default Mqtt;
