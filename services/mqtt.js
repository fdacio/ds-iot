import Paho from "paho-mqtt";
import AsyncStorage from '@react-native-async-storage/async-storage';

//Variáveis de uso global
var clientMqttDSIOT = null;
var borkerMqttHost = null;
var borkerMqttPort = null;
var borkerMqttUser = null;
var borkerMqttPass = null;
var borkerMqttClientId = null;
var borkerMqttTopicSubscribe = null;
var borkerMqttTopicPublish = null;
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
                borkerMqttHost,
                parseInt(borkerMqttPort),
                borkerMqttClientId
            );
        }
        if (hasTopicSubscribe()) {
            if (isConnected()) clientMqttDSIOT.subscribe(borkerMqttTopicSubscribe);
        }

        if (hasTopicPublish()) {
            let message = new Paho.Message("");
            message.destinationName = borkerMqttTopicPublish;
            if (isConnected()) clientMqttDSIOT.send(message);
        }
    }
}

export async function mqttServiceProcessConnect(_callBackConnetionSuccess, _callBackConnetionError) {

    callBackConnetionSuccess = _callBackConnetionSuccess;
    callBackConnetionError = _callBackConnetionError;

    const hasConfig = await loadConfig();
    if (hasConfig) {
        console.log(borkerMqttPort);
        connect();
        return true;
    } else {
        return false;
    }
}

const loadConfig = async () => {
    borkerMqttHost = await AsyncStorage.getItem("borker-mqtt");
    borkerMqttPort = await AsyncStorage.getItem("borker-mqtt-port");
    borkerMqttUser = await AsyncStorage.getItem("borker-mqtt-user");
    borkerMqttPass = await AsyncStorage.getItem("borker-mqtt-pass");
    borkerMqttTopicSubscribe = await AsyncStorage.getItem(`borker-mqtt-topic-subscribe${screenNum}`);
    borkerMqttTopicPublish = await AsyncStorage.getItem(`borker-mqtt-topic-publish${screenNum}`);
    borkerMqttClientId = `mqtt-dsiot-app-android-${(Math.random()) * 1000}`;
    if ((borkerMqttHost == null) || (borkerMqttPort == null) || (borkerMqttUser == null) || (borkerMqttPass == null)) {
        return false;
    }
    return true;
}

const connect = async () => {

    if (isConnected()) {
        clientMqttDSIOT.disconnect();
    }

    const options = {
        userName: borkerMqttUser,
        password: borkerMqttPass,
        mqttVersion: 3,

        onSuccess: () => {

            console.log("Connected successfully: " + borkerMqttClientId);

            clientMqttDSIOT.onMessageArrived = (message) => {
                if (message.destinationName === borkerMqttTopicSubscribe) {
                    payloadString = message.payloadString;
                    if (callBackMessageArrived != null)
                        callBackMessageArrived(payloadString);
                }
            }

            clientMqttDSIOT.onConnectionLost = (error) => {
                console.log("Disconnected! Error:" + error.errorMessage);
                clientMqttDSIOT = null;
            }

            if (callBackConnetionSuccess != null) callBackConnetionSuccess();

            if (hasTopicSubscribe()) {
                if (isConnected()) clientMqttDSIOT.subscribe(borkerMqttTopicSubscribe);
            }
    
            if (hasTopicPublish()) {
                let message = new Paho.Message("");
                message.destinationName = borkerMqttTopicPublish
                if (isConnected()) clientMqttDSIOT.send(message);
            }
        },

        onFailure: (error) => {
            console.log("Connection fail");
            if (callBackConnetionError != null) callBackConnetionError(error.errorMessage);
        }
    };

    if (!hasClientMqtt()) {
        clientMqttDSIOT = new Paho.Client(
            borkerMqttHost,
            parseInt(borkerMqttPort),
            borkerMqttClientId
        );
    }
    clientMqttDSIOT.connect(options);

}

const reconnect = async () => {

}

export function mqttServicePublish(value) {
    let message = new Paho.Message(value);
    message.destinationName = borkerMqttTopicPublish;
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
    if ((borkerMqttTopicSubscribe == null) || (borkerMqttTopicSubscribe == undefined)) {
        return false;
    }
    return true;
}

const hasTopicPublish = () => {
    if ((borkerMqttTopicPublish == null) || (borkerMqttTopicPublish == undefined)) {
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