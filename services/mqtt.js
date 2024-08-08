import Paho from "paho-mqtt";
import AsyncStorage from '@react-native-async-storage/async-storage';

//Variáveis de uso global
var clientMqttDSIOT = null;
var brokenMqttHost = null;
var brokenMqttPort = null;
var brokenMqttUser = null;
var brokenMqttPass = null;
var brokenMqttClientId = null;
var brokenMqttTopicSubscribe = null;
var brokenMqttTopicPublish = null;
var payloadString = null;
var callBackMessageArrived = null;
var callBackConnetionSuccess = null;
var callBackConnetionError = null;
var screenNum = 0;

const MqttService = async (n) => {
    screenNum = n;
    const hasConfig = await loadConfig();
    if (hasConfig) {
        if (!hasClientMqtt()) {
            clientMqttDSIOT = new Paho.Client(
                brokenMqttHost,
                parseInt(brokenMqttPort),
                brokenMqttClientId
            );
        }
        if (hasTopicSubscribe()) {
            if (isConnected()) clientMqttDSIOT.subscribe(brokenMqttTopicSubscribe);
        }

        if (hasTopicPublish()) {
            let message = new Paho.Message("");
            message.destinationName = brokenMqttTopicPublish;
            if (isConnected()) clientMqttDSIOT.send(message);
        }
    }
}

export async function mqttServiceProcessConnect(_callBackConnetionSuccess, _callBackConnetionError) {

    callBackConnetionSuccess = _callBackConnetionSuccess;
    callBackConnetionError = _callBackConnetionError;

    const hasConfig = await loadConfig();
    if (hasConfig) {
        console.log(brokenMqttPort);
        connect();
        return true;
    } else {
        return false;
    }
}

const loadConfig = async () => {
    brokenMqttHost = await AsyncStorage.getItem("broken-mqtt");
    brokenMqttPort = await AsyncStorage.getItem("broken-mqtt-port");
    brokenMqttUser = await AsyncStorage.getItem("broken-mqtt-user");
    brokenMqttPass = await AsyncStorage.getItem("broken-mqtt-pass");
    brokenMqttTopicSubscribe = await AsyncStorage.getItem(`broken-mqtt-topic-subscribe${screenNum}`);
    brokenMqttTopicPublish = await AsyncStorage.getItem(`broken-mqtt-topic-publish${screenNum}`);
    brokenMqttClientId = `mqtt-dsiot-app-android-${(Math.random()) * 1000}`;
    if ((brokenMqttHost == null) || (brokenMqttPort == null) || (brokenMqttUser == null) || (brokenMqttPass == null)) {
        return false;
    }
    return true;
}

const connect = async () => {

    if (isConnected()) {
        clientMqttDSIOT.disconnect();
    }

    const options = {
        userName: brokenMqttUser,
        password: brokenMqttPass,
        mqttVersion: 3,

        onSuccess: () => {

            console.log("Conectado com sucesso: " + brokenMqttClientId);

            clientMqttDSIOT.onMessageArrived = (message) => {
                if (message.destinationName === brokenMqttTopicSubscribe) {
                    payloadString = message.payloadString;
                    if (callBackMessageArrived != null)
                        callBackMessageArrived(payloadString);
                }
            }

            clientMqttDSIOT.onConnectionLost = (error) => {
                console.log("Disconetado! Error:" + error.errorMessage);
                clientMqttDSIOT = null;
            }

            if (callBackConnetionSuccess != null) callBackConnetionSuccess();

            if (hasTopicSubscribe()) {
                if (isConnected()) clientMqttDSIOT.subscribe(brokenMqttTopicSubscribe);
            }
    
            if (hasTopicPublish()) {
                let message = new Paho.Message("");
                message.destinationName = brokenMqttTopicPublish
                if (isConnected()) clientMqttDSIOT.send(message);
            }
        },

        onFailure: (error) => {
            console.log("*** Erro de conexão ***");
            if (callBackConnetionError != null) callBackConnetionError(error.errorMessage);
        }
    };

    if (!hasClientMqtt()) {
        clientMqttDSIOT = new Paho.Client(
            brokenMqttHost,
            parseInt(brokenMqttPort),
            brokenMqttClientId
        );
    }
    clientMqttDSIOT.connect(options);

}

const reconnect = async () => {

}

export function mqttServicePublish(value) {
    let message = new Paho.Message(value);
    message.destinationName = brokenMqttTopicPublish;
    clientMqttDSIOT.send(message);
}

export function mqttServiceSetOnMessageArrived(_callBackMessageArrived) {
    callBackMessageArrived = _callBackMessageArrived;
}

export function mqttServiceStatusConnected() {
    return isConnected();
}

export function mqttServiceHasTopicSubscribe() {
    return hasTopicSubscribe();
}

export function mqttServiceHasTopicPublish() {
    return hasTopicPublish();
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

const isConnected = () => {
    if (hasClientMqtt()) {
        return clientMqttDSIOT.isConnected();
    }
    return false;
}

export default MqttService;