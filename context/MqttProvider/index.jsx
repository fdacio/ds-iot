import React, { createContext, useContext, useState } from "react";
import Paho from "paho-mqtt";
import AppContext from "../AppProvider";


const MqttContext = createContext({});

export const MqttProvider = ({ children }) => {

    const MQTT_VERSION = 3;
    let clientMqttDSIOT = {};

    const appContext = useContext(AppContext);
    const [isConnected, setIsConnected] = useState(false);

    const handlerConnect = async (callBackConnetionSuccess, callBackConnetionError) => {

        let mqttClientId = `dsiot-app-device-${(Math.random()) * 1000}`;

        const brokerParams = await appContext.brokerParamsConnection();

        if (!brokerParams.host) {
            throw Error("Broker Host not provided");
        }

        if (!brokerParams.port) {
            throw Error("Broker Port not provided");
        }

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
                //throw Error("ERROR: " + error.errorMessage);
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

    const handlerMessageArrived = async (topicSubscribe, callBackMessageArrived) => {
        if (!topicSubscribe) return;
        if (!callBackMessageArrived) return;
        clientMqttDSIOT.onMessageArrived = (message) => {
            if (message.destinationName === topicSubscribe) {
                callBackMessageArrived(message.payloadString);
            }
        }

    }

    return (
        <MqttContext.Provider value={
            {
                handlerConnect,
                handlerPublish,
                handlerSubscribe,
                handlerMessageArrived,
                isConnected
            }
        }
        >
            {children}
        </MqttContext.Provider>
    );

}

export default MqttContext;