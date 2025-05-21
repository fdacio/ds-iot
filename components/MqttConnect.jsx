import { useNetInfoInstance } from "@react-native-community/netinfo";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import AppContext from "../context/AppProvider";
import MqttContext from "../context/MqttProvider";

const MqttConnect = () => {

    const appContext = useContext(AppContext);
    const mqttContext = useContext(MqttContext);
    const { netInfo } = useNetInfoInstance();

    const labelWait = "Wait ...";
    const labelConnect = "Connect";
    const [loading, setLoading] = useState(false);


    const _onConnect = async () => {
        if (!netInfo.isConnected) {
            Alert.alert(`${appContext.appName}`, "Check the internet connection");
            return;
        }
        setLoading(true);
        try {
            await mqttContext.handlerConnect(
                (isConnected) => {
                    appContext.dispatch(
                        {
                            type: "mqttConnection",
                            payload: {
                                mqttConnected: isConnected,
                            }
                        });

                    setLoading(false);
                },
                (error) => {

                    let messageError = error.errorMessage;
                    if (messageError.includes('Socket error')) messageError = "Broker host or port invalid";
                    if (messageError.includes('not authorized')) messageError = "Broker user name ou pass invalid";

                    appContext.dispatch(
                        {
                            type: "mqttConnection",
                            payload: {
                                mqttConnected: false,
                            }
                        });

                    setLoading(false);

                    Alert.alert(`${appContext.appName}`, messageError);

                });

        } catch (error) {
            let messageError = error.message;
            if (error.message.includes('host')) messageError = "Broker host not provided";
            if (error.message.includes('port')) messageError = "Broker port not provided";
            if (error.message.includes('userName')) messageError = "Broker user name not provided or invalid";
            if (error.message.includes('password')) messageError = "Broker password not provided or invalid";
            setLoading(false);
            Alert.alert(`${appContext.appName}`, messageError);
            
        }

    }

    const _onDisconnect = () => {
        mqttContext.handlerDisconnect();
    }

    return (
        <>
            {(appContext.state.mqttConnected)
                ? 
                <Pressable onPress={_onDisconnect} style={styles.buttonConnectDisconect}>
                    <Icon name="wifi" color={styles.iconConnected.color} size={24} />
                </Pressable>
                :
                <Pressable onPress={_onConnect} style={styles.buttonConnectDisconect}>
                    {(!loading)
                        ? <Icon name="wifi" color={styles.iconDisconnected.color} size={24} />
                        : <ActivityIndicator color="#ccc" size={24} />
                    }
                    {(loading)
                        ? <Text style={styles.textIconConnection}>{labelWait}</Text>
                        : <Text style={styles.textIconConnection}>{labelConnect}</Text>
                    }
                </Pressable>
            }
        </>
    );
}

const styles = StyleSheet.create({

    buttonConnectDisconect: {
        flexDirection: "row",
        alignItems: 'center',
    },

    textIconConnection: {
        color: "#fff",
        marginLeft: 8
    },

    iconConnected: {
        color: "#00fa00"
    },

    iconDisconnected: {
        color: "#cccccc"
    },

})


export default MqttConnect;