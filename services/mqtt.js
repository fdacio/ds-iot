import AsyncStorage from '@react-native-async-storage/async-storage';
import Paho from "paho-mqtt";

//Variáveis de uso global
var clientMqttDSIOT = null;
var brokenMqttHost = null;
var brokenMqttPort = null;
var brokenMqttUser = null;
var brokenMqttPass = null;
var brokenMqttTopicSubscribe = null;
var brokenMqttTopicPublish = null;
var payloadString = null;
var onMessageArrived = null;
var screenNum = 0;

const MqttService = (n) => {
    screenNum = n;
}

export async function mqttServiceLoadConfig() {
    brokenMqttHost = await AsyncStorage.getItem("broken-mqtt");
    brokenMqttPort = await AsyncStorage.getItem("broken-mqtt-port");
    brokenMqttUser = await AsyncStorage.getItem("broken-mqtt-user");
    brokenMqttPass = await AsyncStorage.getItem("broken-mqtt-pass");
    brokenMqttTopicSubscribe = await AsyncStorage.getItem(`broken-mqtt-topic-subscribe${screenNum}`);
    brokenMqttTopicPublish = await AsyncStorage.getItem(`broken-mqtt-topic-publish${screenNum}`);

    if ((brokenMqttHost == null) || (brokenMqttPort == null) || (brokenMqttUser == null) || (brokenMqttPass == null)) {
        return false;
    }

    return true;
}

export function mqttServiceConnect() {

    let host = brokenMqttHost;
    let port = parseInt(brokenMqttPort);
    let clientId = `mqtt-dsiot-${parseInt(Math.random() * 100000)}`;

    clientMqttDSIOT = new Paho.Client(
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
            if (!clientMqttDSIOT.isConnected()) return;
            if ((brokenMqttTopicSubscribe == null) || (brokenMqttTopicSubscribe == undefined) || brokenMqttTopicSubscribe == "") return;
            clientMqttDSIOT.subscribe(brokenMqttTopicSubscribe);
            
            clientMqttDSIOT.onMessageArrived = (message) => {
                if (message.destinationName === brokenMqttTopicSubscribe) {
                    payloadString = message.payloadString;
                    onMessageArrived()
                }
            }
            clientMqttDSIOT.publish(brokenMqttTopicPublish, "");
        },
        onFailure: (err) => {
            Alert.alert("MQTT", "Conexão Falhou: Ver configurações em Settings");
            return null;
        }
    };

    clientMqttDSIOT.connect(options);

    clientMqttDSIOT.onConnectionLost = () => {
        console.log("Disconetado!");
        clientMqttDSIOT = null;
    }

}

export function mqttServiceDisconnect() {
    if (hasClientMqtt()) {
        if (clientMqttDSIOT.isConnected()) {
            if (hasTopicSubscribe()) {
                clientMqttDSIOT.unsubscribe(brokenMqttTopicSubscribe);
            }
            clientMqttDSIOT.disconnect();
        }
    }
}

export function mqttServicePublish(value) {
    console.log("Tem Client: " + hasClientMqtt());
    console.log("Tem Publish: " +  hasTopicPublish());
    if (hasClientMqtt() && hasTopicPublish()) {
        clientMqttDSIOT.send(brokenMqttTopicPublish, value);
    }
}

export function mqttServiceGetPayload() {
    return payloadString;
}

export function mqttServiceSetOnMessageArrived(callBack) {
    onMessageArrived = callBack;
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


export default MqttService;