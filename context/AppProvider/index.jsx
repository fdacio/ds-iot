import React, { createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { expo } from '../../app.json';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {

    const appName = expo.name
    const appVersion = expo.version;

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
            "host" : (brokerMqttHost) && brokerMqttHost,
            "port" : (brokerMqttPort) && brokerMqttPort,
            "user" : (brokerMqttUser) && brokerMqttUser,
            "pass" : (brokerMqttPass) && brokerMqttPass,
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
            "topicSubscribe": topicSubscribe,
            "topicPublish": topicPublish,
            "title": title
        }

    }
    return (
        <AppContext.Provider value={
            {
                appName,
                appVersion,
                brokerSaveParams,
                brokerParamsConnection,
                screenMqttSaveParams,
                screenMqttParams,
            }
        }
        >
            {children}
        </AppContext.Provider>
    )

}

export default AppContext;
