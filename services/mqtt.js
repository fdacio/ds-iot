import Paho from "paho-mqtt";
import AsyncStorage from '@react-native-async-storage/async-storage';

//Variáveis de uso global
var clientMqttDSIOT = null;
var brokerMqttHost = null;
var brokerMqttPort = null;
var brokerMqttUser = null;
var brokerMqttPass = null;
var brokerMqttClientId = null;
var brokerMqttTopicSubscribe = null;
var brokerMqttTopicPublish = null;
var payloadString = null;
var callBackMessageArrived = null;
var callBackConnetionSuccess = null;
var callBackConnetionError = null;
var screenNum = 0;

const MqttService = async (n) => {
    screenNum = n;
    const hasConfig = await loadConfig();
    if (hasConfig) {
        if (hasTopicSubscribe()) {
            if (isConnected()) clientMqttDSIOT.subscribe(brokerMqttTopicSubscribe);
        }
        if (hasTopicPublish()) {
            let message = new Paho.Message("");
            message.destinationName = brokerMqttTopicPublish;
            if (isConnected()) clientMqttDSIOT.send(message);
        }
    }
}

export async function mqttServiceProcessConnect(_callBackConnetionSuccess, _callBackConnetionError) {

    callBackConnetionSuccess = _callBackConnetionSuccess;
    callBackConnetionError = _callBackConnetionError;

    const hasConfig = await loadConfig();
    if (hasConfig) {
        connect();
        return true;
    } else {
        return false;
    }
}

const loadConfig = async () => {
    brokerMqttHost = await AsyncStorage.getItem("broker-mqtt");
    brokerMqttPort = await AsyncStorage.getItem("broker-mqtt-port");
    brokerMqttUser = await AsyncStorage.getItem("broker-mqtt-user");
    brokerMqttPass = await AsyncStorage.getItem("broker-mqtt-pass");
    brokerMqttTopicSubscribe = await AsyncStorage.getItem(`broker-mqtt-topic-subscribe${screenNum}`);
    brokerMqttTopicPublish = await AsyncStorage.getItem(`broker-mqtt-topic-publish${screenNum}`);

    brokerMqttClientId = `mqtt-dsiot-app-android-${(Math.random()) * 1000}`;
    if ((brokerMqttHost == null) || (brokerMqttPort == null) || (brokerMqttUser == null) || (brokerMqttPass == null)) {
        return false;
    }
    return true;
}

const connect = async () => {

    if (isConnected()) {
        clientMqttDSIOT.disconnect();
    }
    
    const options = {
        userName: brokerMqttUser,
        password: brokerMqttPass,
        mqttVersion: 3,

        onSuccess: () => {

            console.log("Connected successfully: " + brokerMqttClientId);

            clientMqttDSIOT.onMessageArrived = (message) => {
                if (hasTopicSubscribe == null) return;
                if (message.destinationName === brokerMqttTopicSubscribe) {
                    payloadString = message.payloadString;
                    if (callBackMessageArrived != null)
                        callBackMessageArrived(payloadString);
                }
            }

            clientMqttDSIOT.onConnectionLost = (error) => {
                console.log("Disconnected");
                if (error.errorMessage != "OK") {
                    console.log(error.errorMessage);
                }
                clientMqttDSIOT = null;
            }

            if (callBackConnetionSuccess != null) callBackConnetionSuccess();

            if (hasTopicSubscribe()) {
                if (isConnected()) clientMqttDSIOT.subscribe(brokerMqttTopicSubscribe);
            }
    
            if (hasTopicPublish()) {
                let message = new Paho.Message("");
                message.destinationName = brokerMqttTopicPublish
                if (isConnected()) clientMqttDSIOT.send(message);
            }
        },

        onFailure: (error) => {
            console.log("Connection fail");
            let messageFail = "";
            if (error.errorMessage.includes("undefined")) {
                messageFail = "Broker address or port invalid";
            }
            if (error.errorMessage.includes("not authorized")) {
                messageFail = "Broker user or pass invalid";
            }
            if (callBackConnetionError != null) callBackConnetionError(messageFail);
        }
    };

    clientMqttDSIOT = new Paho.Client(
        brokerMqttHost,
        parseInt(brokerMqttPort),
        brokerMqttClientId
    );

    clientMqttDSIOT.connect(options);   

}

const reconnect = async () => {

}

export function mqttServicePublish(value) {
    let message = new Paho.Message(value);
    message.destinationName = brokerMqttTopicPublish;
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
    if ((brokerMqttTopicSubscribe == null) || (brokerMqttTopicSubscribe == undefined)) {
        return false;
    }
    return true;
}

const hasTopicPublish = () => {
    if ((brokerMqttTopicPublish == null) || (brokerMqttTopicPublish == undefined)) {
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