import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNetInfoInstance } from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/FontAwesome';
import { mqttServiceProcessConnect } from '../services/mqtt';
import { expo } from '../app.json';

const Header = forwardRef((props, ref) => {

    const labelWait = "Wait ...";
    const labelConnect = "Connect";

    const [connected, setConnected] = useState(false);
    const [textConnect, setTextConnect] = useState(labelConnect);
    const [loading, setLoading] = useState(false);

    const publicRef = {
        updateStateConneticon: (status) => {
            setConnected(status);
            if (!status) setTextConnect(labelConnect);
        }
    };

    useImperativeHandle(ref, () => publicRef);

    const { netInfo, refresh } = useNetInfoInstance();

    const _onConnect = () => {
        if (!netInfo.isConnected) {
            Alert.alert(`${expo.name}`, "Check the internet connection");
            return;
        }
        setTextConnect(labelWait);
        setLoading(true);
        mqttServiceProcessConnect(
            () => {
                setConnected(true);
                setLoading(false);
            },
            (error) => {
                Alert.alert(`${expo.name}`, "Error connecting to MQTT Broker: " + error);
                setConnected(false);
                setTextConnect(labelConnect);
                setLoading(false);
            }).then((hasConfig) => {
                if (!hasConfig) {
                    Alert.alert(`${expo.name}`, "Error connecting to MQTT Broker. See Settings!");
                    setConnected(false);
                    setTextConnect(labelConnect);
                    setLoading(false);
                }
            });
    }

    return (
        <View style={styles.content}>
            <View style={styles.contentLeft}>
                <Icon name="home" color="#fff" size={32} style={styles.iconLeft} />
            </View>
            <View style={styles.contentTitle}>
                <Text style={styles.title}>{expo.name}</Text>
                <Text style={styles.textVersion}>{expo.version}</Text>
            </View>
            <View style={styles.contentRight}>
                {props.showActionConnect &&
                    <>
                        {connected &&
                            <Icon name="wifi" color={styles.iconConnected.color} size={24} />
                        }

                        {!connected &&
                            <Pressable onPress={_onConnect} style={styles.buttonConnect}>
                                {(!loading) &&
                                    <Icon name="wifi" color={styles.iconDisconnected.color} size={24} />
                                }
                                {(loading) &&
                                    <ActivityIndicator color="#ccc" size={24} />
                                }
                                <Text style={styles.textIconConnection}>{textConnect}</Text>
                            </Pressable>
                        }
                    </>
                }
            </View>
        </View>
    );
})

const styles = StyleSheet.create({

    content: {
        backgroundColor: '#201f1f',
        height: 56,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    contentLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },

    contentTitle: {
        flex: 1,
        alignItems: 'center',
    },

    contentRight: {
        flex: 1,
        alignItems: 'flex-end',
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    textVersion: {
        fontSize: 8,
        color: '#ccc',
    },
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

export default Header
