import Paho from "paho-mqtt";
import { createContext, useContext, useEffect } from "react";
import AppContext from "../AppProvider";

const MqttContext = createContext({});
/** Variáveis de instâncias */
let clientMqtt = null;
let callBackPostConnected = null;

export const MqttProvider = ({ children }) => {

    const appContext = useContext(AppContext);
    
    const MQTT_VERSION = 3;
    const mqttClientId = `dsiot-app-device-${(Math.random()) * 1000}`; //Melhoria: pegar um identificador único do dispositivo (IMEI por exemplo)

    useEffect(() => {
        appContext.dispatch(
            {
                type: "mqttConnection",
                payload: {
                    mqttConnected: handlerIsConnected(),
                }
            });
    }, []);

    const handlerConnect = async (callBackConnectionSuccess, callBackConnectionError) => {

        const brokerParams = await appContext.brokerParamsConnection();

        clientMqtt = new Paho.Client(
            brokerParams.host,
            parseInt(brokerParams.port),
            mqttClientId
        );

        const options = {
            userName: brokerParams.user,
            password: brokerParams.pass,
            mqttVersion: MQTT_VERSION,

            onSuccess: () => {
                let _isConnected = clientMqtt.isConnected();
                if (callBackConnectionSuccess) callBackConnectionSuccess(_isConnected);
                if (callBackPostConnected) callBackPostConnected();
            },

            onFailure: (error) => {
                clientMqtt = null;
                if (callBackConnectionError != null) callBackConnectionError(error);
            }

        };

        clientMqtt.onConnectionLost = (error) => {
            appContext.dispatch(
                {
                    type: "mqttConnection",
                    payload: {
                        mqttConnected: false,
                        mqttError: error
                    }
                });

            clientMqtt = null;
        }

        clientMqtt.connect(options);
    }

    const handlerDisconnect = () => {
        if (mqttDontConnected()) return;
        clientMqtt.disconnect();
        clientMqtt = null;
    }

    const handlerPublish = (topic, payload) => {
        if (mqttDontConnected()) return;
        let message = new Paho.Message(payload);
        message.destinationName = topic;
        clientMqtt.send(message);
    }

    const handlerSubscribe = (topic) => {
        if (mqttDontConnected()) return;
        clientMqtt.subscribe(topic);
    }

    const handlerPostConnected = (_callBackPostConnected) => {
        callBackPostConnected = _callBackPostConnected;
    }

    const handlerIsConnected = () => {
        if (mqttDontConnected()) return false;
        return clientMqtt.isConnected();
    }

    const handlerListenerSubscribe = async (topicSubscrive, callMessageArrived) => {
        if (mqttDontConnected()) return;
        clientMqtt.subscribe(topicSubscrive);
        clientMqtt.onMessageArrived = (message) => {
            if (message.destinationName === topicSubscrive) {
                callMessageArrived(message.payloadString);
            }
        }
    }

    const mqttDontConnected = () => {
        return (!clientMqtt);
    }

    return (
        <MqttContext.Provider value={
            {
                handlerConnect,
                handlerDisconnect,
                handlerPublish,
                handlerSubscribe,
                handlerPostConnected,
                handlerIsConnected,
                handlerListenerSubscribe
            }
        }
        >
            {children}
        </MqttContext.Provider>
    );

}

export default MqttContext;
