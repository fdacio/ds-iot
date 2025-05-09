import { useNetInfoInstance } from "@react-native-community/netinfo";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import AppContext from "../context/AppProvider";
import MqttContext from "../context/MqttProvider";

const MqttConnect = () => {

    const mqttContext = useContext(MqttContext);
    const appContext = useContext(AppContext);

    const labelWait = "Wait ...";
    const labelConnect = "Connect";
    const [textConnect, setTextConnect] = useState(labelConnect);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const { netInfo } = useNetInfoInstance();


    const _onConnect = async () => {
        if (!netInfo.isConnected) {
            Alert.alert(`${appContext.appName}`, "Check the internet connection");
            return;
        }
        setTextConnect(labelWait);
        setLoading(true);
        try {
            await mqttContext.handlerConnect(
                (client) => {
                    setConnected(client.isConnected());
                    setLoading(false);
                },
                (error) => {
                    Alert.alert(`${appContext.appName}`, error);
                    setConnected(false);
                    setTextConnect(labelConnect);
                    setLoading(false);
                });
                

        } catch (error) {
            Alert.alert(`${appContext.appName}+++`, error.message);
            setTextConnect(labelConnect);
            setLoading(false);
        }
    }

    return (
        <>
            {(connected)
                ? <Icon name="wifi" color={styles.iconConnected.color} size={24} />
                :
                <Pressable onPress={_onConnect} style={styles.buttonConnect}>
                    {(!loading)
                        ? <Icon name="wifi" color={styles.iconDisconnected.color} size={24} />
                        : <ActivityIndicator color="#ccc" size={24} />
                    }
                    <Text style={styles.textIconConnection}>{textConnect}</Text>
                </Pressable>
            }
        </>
    );
}

const styles = StyleSheet.create({

    buttonConnect: {
        flexDirection: "row",
        textAlignVertical: 'center'
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