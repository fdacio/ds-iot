import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Paho from "paho-mqtt";


let clientMqtt;

const Mqtt = ({ navigation }) => {

    const isFocused = useIsFocused();

    let brokenMqttHost;
    let brokenMqttPort;
    let brokenMqttUser;
    let brokenMqttPass;
    let brokenMqttTopicSubscribe;
    let brokenMqttTopicPublish;

    const loadMqttConfig = async () => {

        brokenMqttHost = await AsyncStorage.getItem("broken-mqtt");
        brokenMqttPort = await AsyncStorage.getItem("broken-mqtt-port");
        brokenMqttUser = await AsyncStorage.getItem("broken-mqtt-user");
        brokenMqttPass = await AsyncStorage.getItem("broken-mqtt-pass");
        brokenMqttTopicSubscribe = await AsyncStorage.getItem("broken-mqtt-topic-subscribe");
        brokenMqttTopicPublish = await AsyncStorage.getItem("broken-mqtt-topic-publish");

        let host = brokenMqttHost;
        let port = parseInt(brokenMqttPort);
        let clientId = `mqtt-dsiot-${parseInt(Math.random() * 100)}`;

        clientMqtt = new Paho.Client(
            host,
            port,
            clientId
        );

        const options = {
            userName: brokenMqttUser,
            password: brokenMqttPass,
            mqttVersion: 3,
            onSuccess: () => {
                console.log("Conectado com sucesso!");
                clientMqtt.subscribe(brokenMqttTopicSubscribe);
                clientMqtt.onMessageArrived = (message) => {
                    if (message.destinationName === brokenMqttTopicSubscribe) {
                        console.log(message.payloadString);
                    }
                }
            },
            onFailure: (err) => {
                Alert.alert("MQTT", "Conexão Falhou: " + JSON.stringify(err, null, '\t'));
            }
        };

        clientMqtt.connect(options);

        clientMqtt.onConnectionLost = () => {
            console.log("Disconetado!");
        }
    }

    useEffect(() => {
        if (isFocused) {
            loadMqttConfig();
        } else {
            if (clientMqtt.isConnected()) {
                clientMqtt.disconnect();
            }
        }
    }, [navigation, isFocused]);

    const _on = () => {
        try {
            clientMqtt.send(brokenMqttTopicPublish, "on");
        } catch (error) {
            Alert.alert("MQTT", error.message);
        }
    }

    const _off = async () => {
        try {
            clientMqtt.send(brokenMqttTopicPublish, "off");
        } catch (error) {
            Alert.alert("MQTT", error.message);
        }
    }

    return (
        <View style={styles.container}>
            <Header title="DS - IOT" />
            <HeaderScreen title="MQTT" />
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

    contentButtons: {
        justifyContent: 'center',
        flex: 1,
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
