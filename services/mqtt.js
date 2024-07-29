import Paho from "paho-mqtt";
import AsyncStorage from '@react-native-async-storage/async-storage';


//Variáveis de uso global
var clientMqttDSIOT = null;
var brokenMqttHost = null;
var brokenMqttPort = null;
var brokenMqttUser = null;
var brokenMqttPass = null;
var brokenMqttTopicSubscribe = null;
var brokenMqttTopicPublish = null;
var payloadString = null;
var callBackMessage = null;
var callBackConnetionSuccess = null;
var callBackConnetionError = null;
var screenNum = 0;

const MqttService = async (n) => {
    screenNum = n;
    const hasConfig = await loadConfig();
    if (hasConfig) {
        if (hasTopicSubscribe()) {
            if (isConnected()) clientMqttDSIOT.subscribe(brokenMqttTopicSubscribe);
        }

        if (hasTopicPublish()) {
            if (isConnected()) clientMqttDSIOT.publish(brokenMqttTopicPublish, "");
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

const connect = async () => {

    if (isConnected()) {
        clientMqttDSIOT.disconnect();
    }

    let host = brokenMqttHost;
    let port = parseInt(brokenMqttPort);
    let clientId = `mqtt-dsiot-app-android-${(Math.random()) * 1000}`;

    clientMqttDSIOT = new Paho.Client(
        host,
        port,
        clientId
    );

    const options = {
        userName: brokenMqttUser,
        password: brokenMqttPass,
        mqttVersion: 3,

        onSuccess: () => {

            console.log("Conectado com sucesso: " + clientId);

            clientMqttDSIOT.onMessageArrived = (message) => {
                if (message.destinationName === brokenMqttTopicSubscribe) {
                    payloadString = message.payloadString;
                    if (callBackMessage != null)
                        callBackMessage(payloadString);
                }
            }

            clientMqttDSIOT.onConnectionLost = () => {
                console.log("Disconetado!");
                clientMqttDSIOT = null;
            }
            if (callBackConnetionSuccess != null) callBackConnetionSuccess();

            if (hasTopicSubscribe()) {
                if (isConnected()) clientMqttDSIOT.subscribe(brokenMqttTopicSubscribe);
            }

            if (hasTopicPublish()) {
                if (isConnected()) clientMqttDSIOT.publish(brokenMqttTopicPublish, "");
            }
        },

        onFailure: (error) => {
            if (callBackConnetionError != null) callBackConnetionError(error.errorMessage);
        }
    };

    clientMqttDSIOT.connect(options);

}

export function mqttServicePublish(value) {
    console.log("Tem Client: " + hasClientMqtt());
    console.log("Tem Publish: " + hasTopicPublish());
    if (hasClientMqtt() && hasTopicPublish()) {
        clientMqttDSIOT.send(brokenMqttTopicPublish, value);
    }
}

export function mqttServiceSetOnMessageArrived(_callBackMessageArrived) {
    callBackMessage = _callBackMessageArrived;
}

export function mqttServiceStatusConnected() {
    return isConnected();
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