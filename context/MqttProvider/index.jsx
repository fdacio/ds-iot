import Paho from "paho-mqtt";
import { createContext, useContext } from "react";
import AppContext from "../AppProvider";

const MqttContext = createContext({});
/** Variáveis de instânica */
let clientMqtt = null;
let callBackPostConnected = null;

export const MqttProvider = ({ children }) => {

    const appContext = useContext(AppContext);

    const MQTT_VERSION = 3;
    const mqttClientId = `dsiot-app-device-${(Math.random()) * 1000}`;

    const handlerConnect = async (callBackConnetionSuccess, callBackConnetionError) => {

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
                if (callBackConnetionSuccess) callBackConnetionSuccess(_isConnected);
                if (callBackPostConnected) callBackPostConnected();
            },

            onFailure: (error) => {
                clientMqtt = null;
                if (callBackConnetionError != null) callBackConnetionError(error);
            }

        };


        clientMqtt.onConnectionLost = (error) => {
            appContext.dispatch(
                {
                    type: "mqtt-connection",
                    payload: {
                        mqttConnected: false,
                        mqttError: error
                    }
                });

            clientMqtt = null;
        }

        clientMqtt.connect(options);
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