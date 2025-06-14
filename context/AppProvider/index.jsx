import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useReducer } from "react";
import { expo } from '../../app.json';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {

    const appName = expo.name
    const appVersion = expo.version;
    const defaultTitles = ["On/Off 1", "On/Off 2", "On/Off 3", "Weather"];
    const numbersScreen = [1,2,3,4];
    const initialState = { titles: defaultTitles, mqttConnected: false };
    
    /*Chamada na loadTitles para inicializar os títulos das telas*/
    const titlesScreens = (numbersScreen) => {
        const titles = numbersScreen.map(async (n, key) => {
            let title = await AsyncStorage.getItem(`title-screen${n}`);
            return (title) ? title : defaultTitles[key];
        });
        return Promise.all(titles);
    }

    const loadTitles = async () => {
        const titles = await titlesScreens(numbersScreen);
        dispatch(
            { 
                type: 'loadTitles', 
                payload: { titles: titles } 
            }
        );
    }

    useEffect(() => {
        loadTitles();
    }, []);

    /** useReducer */
    function reducer(state, action) {
        if (action.type == "updateTitle") {
            const payload = action.payload;
            const idxNewTitle = (payload.n) - 1;
            const newTitle = payload.title;
            return {
                ...state,
                titles: state.titles.map((item, idx) => idx === idxNewTitle ? newTitle : item)
            }
        }
        if (action.type == "loadTitles") {
            const payload = action.payload;
            const _titles = payload.titles;
            return {
                ...state,
                titles: _titles
            }
        }
        if (action.type === "mqttConnection") {
            const payload = action.payload;
            return {
                ...state,
                mqttConnected: payload.mqttConnected,
                mqttError: payload.mqttError
            }
        }
        if (action.type === "mqttDataOnOff") {
            const payload = action.payload;
            return {
                ...state,
                mqttDataOnOff : payload.OnOff, 
            }
        }
        if (action.type === "mqttDataDHT") {
            const payload = action.payload;
            return {
                ...state,
                mqttDataDHT: payload.dht,
            }
        }
        return state;
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    /** Fim do useReducer*/

    /** Funções disponibilizadas/exportadas pelo AppProvider */
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
