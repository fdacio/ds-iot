import React, { createContext, useContext, useState } from "react";
import Paho from "paho-mqtt";
import AppContext from "../AppProvider";

const MQTT_VERSION = 3;
let clientMqttDSIOT = NULL;

const MqttContext = createContext({});

export const MqttProvider = (props) => {

    const [isConnected, setIsConnected] = useState(false);
    const appContext = useContext(AppContext);

    const handlerConnect = (callBackConnetionSuccess, callBackConnetionError) => {

        let mqttClientId = `dsiot-app-device-${(Math.random()) * 1000}`;

        const brokerParams = appContext.brokerParamsConnection();

        clientMqttDSIOT = new Paho.Client(
            brokerParams.host,
            parseInt(brokerParams.port),
            mqttClientId
        );

        const options = {
            userName: brokerParams.user,
            password: brokerParams.pass,
            mqttVersion: MQTT_VERSION,

            onSuccess: () => {

                setIsConnected(true);

                clientMqttDSIOT.onConnectionLost = (error) => {
                    clientMqttDSIOT = null;
                    setIsConnected(false);
                }

                if (callBackConnetionSuccess != null) callBackConnetionSuccess();

            },

            onFailure: (error) => {
                setIsConnected(false);
                let messageFail = "";
                if (error.errorMessage.includes("undefined")) {
                    messageFail = "Broker address or port invalid";
                } else if (error.errorMessage.includes("not authorized")) {
                    messageFail = "Broker user or pass invalid";
                } else {
                    messageFail = error.errorMessage;
                }
                if (callBackConnetionError != null) callBackConnetionError(messageFail);
            }
        };


        clientMqttDSIOT.connect(options);

    }
    const handlerPublish = async (topic, payload) => {
        if (!isConnected) return;
        let message = new Paho.Message(payload);
        message.destinationName = topic;
        clientMqttDSIOT.send(message);
    }

    const handlerSubscribe = async (topic) => {
        if (!isConnected) return;
        clientMqttDSIOT.subscribe(topic);
    }

    return (
        <MqttContext.Provider value={
            [
                handlerConnect(),
                handlerPublish(),
                handlerSubscribe(),
                isConnected
            ]
        }
        >
            {props.children}
        </MqttContext.Provider>
    );

}

export default MqttContext;