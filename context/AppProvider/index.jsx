import React, { createContext, useEffect, useReducer, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { expo } from '../../app.json';

const AppContext = createContext({});

let initialTitles = ["On/Off 1", "On/Off 2", "Weather", "Settings4"];
const getInitialTitles = (numbersScreen) => {
    numbersScreen.map(async (n) => {
        let title = await AsyncStorage.getItem(`title-screen${n}`);
        if(title) initialTitles[n-1] = title;
    });
}
getInitialTitles([1,2,3,4]);

export const AppProvider = ({ children }) => {

    const appName = expo.name
    const appVersion = expo.version;
    const initialState = { titles: initialTitles };

    function reducer(state, action) {
        if (action.type == "save-params") {
            const titles = action.payload;
            const n = titles.n - 1;
            const newTitle = titles.title;
            return {
                ...state,
                titles: state.titles.map((item, idx) => idx === n ? newTitle : item)
            }
        }
        return state;
    }
    const [state, dispatch] = useReducer(reducer, initialState);


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
        return {
            "title": _title,
            "topicSubscribe": topicSubscribe,
            "topicPublish": topicPublish,
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
    const titlesScreens = (numbersScreen) => {
        const titles = numbersScreen.map(async (n) => {
            let title = await AsyncStorage.getItem(`title-screen${n}`);
            return title;
        });
        return Promise.all(titles);
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
                state,
                dispatch
            }
        }
        >
            {children}
        </AppContext.Provider>
    )

}

export default AppContext;
