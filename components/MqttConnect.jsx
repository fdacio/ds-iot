import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, StyleSheet, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { expo } from '../app.json';
import MqttContext from "../context/MqttProvider";
import { useNetInfoInstance } from "@react-native-community/netinfo";

const MqttConnect = () => {

    const mqttContext = useContext(MqttContext);

    const [textConnect, setTextConnect] = useState("");
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    const labelWait = "Wait ...";
    const labelConnect = "Connect";
    const { netInfo } = useNetInfoInstance();

    useEffect(() => {
        setConnected(mqttContext.isConnected);
    }, []);

    const _onConnect = () => {
        if (!netInfo.isConnected) {
            Alert.alert(`${expo.name}`, "Check the internet connection");
            return;
        }
        setTextConnect(labelWait);
        setLoading(true);
        try {
            mqttContext.handlerConnect(
                () => {
                    setConnected(true);
                    setLoading(false);
                },
                (error) => {
                    Alert.alert(`${expo.name}`, error);
                    setConnected(false);
                    setTextConnect(labelConnect);
                    setLoading(false);
                });
        } catch (error) {
            Alert.alert(`${expo.name}`, error.message);
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
                    <Text style={styles.textIconConnection}>{labelConnect}</Text>
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