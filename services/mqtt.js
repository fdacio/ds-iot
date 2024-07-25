//Variáveis de uso global
var clientMqttDSIOT = null;
var brokenMqttHost = null;
var brokenMqttPort = null;
var brokenMqttUser = null;
var brokenMqttPass = null;
var brokenMqttTopicSubscribe = null;
var brokenMqttTopicPublish = null;

const MqttService = () => {

}

export async function loadMqttConfig(screenNum) {
    brokenMqttHost = await AsyncStorage.getItem("broken-mqtt");
    brokenMqttPort = await AsyncStorage.getItem("broken-mqtt-port");
    brokenMqttUser = await AsyncStorage.getItem("broken-mqtt-user");
    brokenMqttPass = await AsyncStorage.getItem("broken-mqtt-pass");
    brokenMqttTopicSubscribe = await AsyncStorage.getItem("broken-mqtt-topic-subscribe1");
    brokenMqttTopicPublish = await AsyncStorage.getItem("broken-mqtt-topic-publish1");

    if ((brokenMqttHost == null) || (brokenMqttPort == null) || (brokenMqttUser == null) || (brokenMqttPass == null)) {
        return false;
    }

    return true;
}

export function connectMqtt () {

    let host = brokenMqttHost;
    let port = parseInt(brokenMqttPort);
    let clientId = `mqtt-dsiot-${parseInt(Math.random() * 100000)}`;

    let _client = new Paho.Client(
        host,
        port,
        clientId
    );

    const options = {
        userName: brokenMqttUser,
        password: brokenMqttPass,
        mqttVersion: 3,
        onSuccess: async () => {
            console.log("Conectado com sucesso!");
            if (brokenMqttTopicSubscribe == null) return;
            _client.subscribe(brokenMqttTopicSubscribe);
            _client.onMessageArrived = (message) => {
                if (message.destinationName === brokenMqttTopicSubscribe) {
                    if (message.payloadString == "on") {
                        setStateLed(true);
                    } else if (message.payloadString == "off") {
                        setStateLed(false);
                    }
                }
            }
        },
        onFailure: (err) => {
            Alert.alert("MQTT", "Conexão Falhou: Ver configurações em Settings");
            return null;
        }
    };

    _client.connect(options);

    _client.onConnectionLost = () => {
        console.log("Disconetado!");
        clientMqttDSIOT = null;
    }

    return _client;

}


export default MqttService;