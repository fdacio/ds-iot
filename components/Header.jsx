import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { mqttServiceProcessConnect } from '../services/mqtt';
import { app } from '../app.json';

const Header = forwardRef((props, ref) => {

    const labelWait = "Aguarde ...";
    const labelConnect = "Conectar";

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

    const _onConnect = () => {
        setTextConnect(labelWait);
        setLoading(true);
        mqttServiceProcessConnect(
            () => {
                setConnected(true);
                setLoading(false);
            },
            (error) => {
                Alert.alert(`${app.name}`, "Erro ao conectar com Broken MQTT: " + error);
                setConnected(false);
                setTextConnect(labelConnect);
                setLoading(false);
            }).then((hasConfig) => {
                if (!hasConfig) {
                    Alert.alert(`${app.name}`, "Erro ao conectar com Broken MQTT. Ver Settings!");
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
                <Text style={styles.title}>{app.name}</Text>
                <Text style={styles.textVersion}>{app.version}</Text>
            </View>
            <View style={styles.contentRight}>
                {props.actionConnect &&
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
