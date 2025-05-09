import React, { createContext, useContext, useState } from "react";
import Paho from "paho-mqtt";
import AppContext from "../AppProvider";

const MqttContext = createContext({});

export const MqttProvider = ({ children }) => {

    const MQTT_VERSION = 3;
    const [clientMqtt, setClientMqtt] = useState();

    const appContext = useContext(AppContext);
    const [isConnected, setIsConnected] = useState(false);

    const handlerConnect = async (callBackConnetionSuccess, callBackConnetionError) => {

        const brokerParams = await appContext.brokerParamsConnection();
        
        if (!brokerParams.host) {
            throw Error("Broker Host not provided");
        }
        
        if (!brokerParams.port) {
            throw Error("Broker Port not provided");
        }
        
        let mqttClientId = `dsiot-app-device-${(Math.random()) * 1000}`;
        let _clientMqtt = new Paho.Client(
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
                setClientMqtt(_clientMqtt);

                _clientMqtt.onConnectionLost = (error) => {
                    setClientMqtt(null);
                    setIsConnected(false);
                }

                if (callBackConnetionSuccess != null) callBackConnetionSuccess();

            },

            onFailure: (error) => {
                setClientMqtt(null);
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

        _clientMqtt.connect(options);

    }
    const handlerPublish = async (topic, payload) => {
        if (!clientMqtt) return;
        let message = new Paho.Message(payload);
        message.destinationName = topic;
        clientMqtt.send(message);
    }

    const handlerSubscribe = async (topic) => {
        if (!clientMqtt) return;
        clientMqtt.subscribe(topic);
    }

    const handlerMessageArrived = async (topicSubscribe, callBackMessageArrived) => {
        if (!topicSubscribe) return;
        if (!callBackMessageArrived) return;
        if (!clientMqtt) return;
        clientMqtt.onMessageArrived = (message) => {
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