import React, { createContext, useContext, useState, useReducer } from "react";
import Paho from "paho-mqtt";
import AppContext from "../AppProvider";

const MqttContext = createContext({});

export const MqttProvider = ({ children }) => {

    const appContext = useContext(AppContext);
    const [isConnected, setIsConnected] = useState(false);
    const [clientMqtt, setClientMqtt] = useState();

    const MQTT_VERSION = 3;
    const mqttClientId = `dsiot-app-device-${(Math.random()) * 1000}`;

    const handlerConnect = async (callBackConnetionSuccess, callBackConnetionError) => {

        const brokerParams = await appContext.brokerParamsConnection();

        if (!brokerParams.host) {
            throw Error("Broker Host not provided");
        }

        if (!brokerParams.port) {
            throw Error("Broker Port not provided");
        }


        let _client = new Paho.Client(
            brokerParams.host,
            parseInt(brokerParams.port),
            mqttClientId
        );

        const options = {
            userName: brokerParams.user,
            password: brokerParams.pass,
            mqttVersion: MQTT_VERSION,

            onSuccess: () => {
                setIsConnected(_client.isConnected());
                if (_client.isConnected()) {
                    console.log("CONNECTADO");
                } else {
                    console.log("não CONNECTADO");
                }
                setClientMqtt(_client);
                handlerSubscribeAll(_client);
                if (callBackConnetionSuccess) callBackConnetionSuccess(_client);
            },

            onFailure: (error) => {
                setIsConnected(false);
                setClientMqtt(null);
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


        _client.onConnectionLost = (error) => {
            console.error("Connection Lost: " + JSON.stringify(error));
            setIsConnected(false);
            setClientMqtt(null);
        }

        _client.connect(options);


    }

    const handlerPublish = (topic, payload) => {
        if (!clientMqtt) return;
        let message = new Paho.Message(payload);
        message.destinationName = topic;
        clientMqtt.send(message);
    }

    const handlerSubscribe = (topic) => {
        if (!clientMqtt) return;
        clientMqtt.subscribe(topic);
    }

    const handlerMessageArrived = (topicSubscribe, callBackMessageArrived) => {
        if (!topicSubscribe) return;
        if (!callBackMessageArrived) return;
        if (!clientMqtt) return;
        clientMqtt.onMessageArrived = (message) => {
            if (message.destinationName === topicSubscribe) {
                callBackMessageArrived(message.payloadString);
            }
        }
    }

    const handlerSubscribeAll = async (client) => {
        if (!client) return;
        const topics = await appContext.topicsSubscribe();
        console.log("***subscribe all *****");
        console.log(topics);
        topics.map(topic => {
            client.subscribe(topic);
            client.onMessageArrived = (message) => {
                if (message.destinationName === topic) {
                    callBackMessageArrived(message.payloadString);
                }
            }
        });
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