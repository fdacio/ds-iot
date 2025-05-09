import React, { createContext, useReducer, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { expo } from '../../app.json';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {

    const appName = expo.name
    const appVersion = expo.version;

    const [titleScreen, setTitleScreen] = useState('');
    const [titlesTab, setTitlesTab] = useState([1,2,3]);

    function reducer (state, action) {
        if (action.type == "save-params") {
            const newTitle = action.payload;
            return newTitle;
        }
        return state;
    }

    const [state, dispatch] = useReducer(reducer, titleScreen);

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
            "host": (brokerMqttHost) && brokerMqttHost,
            "port": (brokerMqttPort) && brokerMqttPort,
            "user": (brokerMqttUser) && brokerMqttUser,
            "pass": (brokerMqttPass) && brokerMqttPass,
        }
    }

    const screenMqttSaveParams = async (screenNumber, params) => {
        await AsyncStorage.setItem(`broker-mqtt-topic-subscribe${screenNumber}`, params.topicSubscribe);
        await AsyncStorage.setItem(`broker-mqtt-topic-publish${screenNumber}`, params.topicPublish);
        await AsyncStorage.setItem(`title-screen${screenNumber}`, params.title);
    }

    const screenMqttParams = async (screenNumber) => {

        let topicSubscribe = await AsyncStorage.getItem(`broker-mqtt-topic-subscribe${screenNumber}`);
        let topicPublish = await AsyncStorage.getItem(`broker-mqtt-topic-publish${screenNumber}`);
        let _title = await AsyncStorage.getItem(`title-screen${screenNumber}`);
        setTitleScreen(_title);
        return {
            "topicSubscribe": topicSubscribe,
            "topicPublish": topicPublish,
            "title": titleScreen
        }
    }

    const topicsSubscribe = async () => {
        const topics = new Array(1, 2, 3).map(async (n) => {
            let topic = await AsyncStorage.getItem(`broker-mqtt-topic-subscribe${n}`);
            return topic;
        });
        return await Promise.all(topics);
    }

    /*numbersScreen: array de numeros das telas*/
    const titlesScreens = async (numbersScreen) => {
        const titles = numbersScreen.map(async (n) => {
            let title = await AsyncStorage.getItem(`title-screen${n}`);
            return title;
        });
        const titlesTabe = await Promise.all(titles);
        setTitlesTab(titlesTabe);
        return await Promise.all(titles);
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
                topicsSubscribe,
                titlesScreens,
                titleScreen,
                titlesTab,
                dispatch
            }
        }
        >
            {children}
        </AppContext.Provider>
    )

}

export default AppContext;
