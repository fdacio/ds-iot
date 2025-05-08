import React, { createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext({});

export const AppProvider = (props) => {

    return (
        <AppContext.Provider value={
            [
                brokerSaveParams(params),
                brokerParamsConnection(),
                screenMqttSaveParams(screenNumber, params),
                screenMqttParams(screenNumber)
            ]
        }
        >
            {props.children}
        </AppContext.Provider>
    )
}

const brokerSaveParams = async (params) => {
    await AsyncStorage.setItem("broker-mqtt", params.host);
    await AsyncStorage.setItem("broker-mqtt-port", params.port);
    await AsyncStorage.setItem("broker-mqtt-user", params.user);
    await AsyncStorage.setItem("broker-mqtt-pass", params.pass);
}

const brokerParamsConnection = async () => {
    let brokerMqttHost = await AsyncStorage.getItem("broker-mqtt");
    let brokerMqttPort = await AsyncStorage.getItem("broker-mqtt-port");
    let brokerMqttUser = await AsyncStorage.getItem("broker-mqtt-user");
    let brokerMqttPass = await AsyncStorage.getItem("broker-mqtt-pass");

    return {
        "host" : brokerMqttHost,
        "port" : brokerMqttPort,
        "user" : brokerMqttUser,
        "pass" : brokerMqttPass,
    }
}

const screenMqttSaveParams = async (screenNumber, params) => {
    await AsyncStorage.getItem(`broker-mqtt-topic-subscribe${screenNumber}`, params.topicSubscribe);
    await AsyncStorage.getItem(`broker-mqtt-topic-publish${screenNumber}`, params.topicPublish);
    await AsyncStorage.getItem(`title-screen${screenNumber}`, params.title);
}

const screenMqttParams = async (screenNumber) => {

    let topicSubscribe = await AsyncStorage.getItem(`broker-mqtt-topic-subscribe${screenNumber}`);
    let topicPublish = await AsyncStorage.getItem(`broker-mqtt-topic-publish${screenNumber}`);
    let title = await AsyncStorage.getItem(`title-screen${screenNumber}`);

    return {
        "topicSubscribe" : topicSubscribe,
        "topicPublish" : topicPublish,
        "title" : title
    }

}

export default AppContext;
