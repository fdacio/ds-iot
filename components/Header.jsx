import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { mqttServiceStatusConnected, mqttServiceProcessConnect } from '../services/mqtt';

const Header = (props) => {

    const [connected, setConnected] = useState(false);
    const [textConnect, setTextConnect] = useState("Conectar");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setConnected(props.connected);
    }, [props]);

    const _onConnect = () => {
        if (!mqttServiceStatusConnected()) {
            setTextConnect("Aguarde ...");
            setLoading(true);
            mqttServiceProcessConnect(
                () => {
                    setConnected(true);
                    setLoading(false);
                    setTextConnect("Conectar");             
                },
                (error) => {
                    Alert.alert("DS-IOT", "Erro ao conectar com Broken MQTT: " + error);
                    setConnected(false);
                    setTextConnect("Conectar");
                    setLoading(false);
                }).then((hasConfig) => {
                    if (!hasConfig) {
                        Alert.alert("DS-IOT", "Erro ao conectar com Broken MQTT. Ver Settings!");
                        setConnected(false);
                        setTextConnect("Conectar");
                        setLoading(false);
                    }
                });
        }
    }

    return (
        <View style={styles.content}>
            <View style={styles.contentLeft}>
                <Icon name="home" color="#fff" size={32} style={styles.iconLeft}/>
            </View>
            <View style={styles.contentTitle}>
                <Text style={styles.title}>DS-IOT</Text>
            </View>
            <View style={styles.contentRight}>
                {props.actionConnect &&
                <Pressable onPress={() => _onConnect()} style={styles.buttonConnect}>
                    {(!loading) &&
                        <Icon name="wifi" color={(connected) ? styles.iconConnected.color : styles.iconDisconnected.color} size={24} />
                    }
                    {(loading) &&
                        <ActivityIndicator color="#ccc" size={32} />
                    }
                    {(!connected) &&
                        <Text style={styles.textIconConnection}>{textConnect}</Text>
                    }
                </Pressable>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        flexDirection: 'row',
        backgroundColor: '#201f1f',
        height: 56,
        paddingHorizontal: 8,
    },

    contentLeft: {
        flex: 2,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    contentTitle: {
        flex: 2,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
    },

    contentRight: {
        flex: 2,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    title: {
        flex: 3,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlignVertical: 'center'
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
    }
})

export default Header