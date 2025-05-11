import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ButtonOnOff from '../components/ButtonOnOff';
import HeaderScreen from '../components/HeaderScreen';
import IconBulb from '../components/IconBulb';
import AppContext from '../context/AppProvider';
import MqttContext from '../context/MqttProvider';

const OnOff = (props) => {

    const appContext = useContext(AppContext);
    const mqttContext = useContext(MqttContext);
    const isFocused = useIsFocused();

    const [title, setTitle] = useState();
    const [stateBulb, setStateBulb] = useState(false);
    const [screenParams, setScreenParmas] = useState();
    
    let topicSubscribe;

    useEffect(() => {
        if (isFocused) {
            const load = async () => {
                const params = await appContext.screenMqttParams(props.numScreen);
                setScreenParmas(params);
                topicSubscribe = params.topicSubscribe;
                setTitle((params.title) ? params.title : props.title);
                mqttContext.handlerPostConnected(postMqttConnected);
                mqttContext.handlerListenerSubscribe(topicSubscribe, updateStateBulb);
            }
            load();
        }
    }, [isFocused]);

    const postMqttConnected = () => {
        if(mqttContext.handlerIsConnected()) {
            mqttContext.handlerListenerSubscribe(topicSubscribe, updateStateBulb);
        }
    }

    const updateStateBulb = (message) => {
        if (message === "on") {
            setStateBulb(true);
        }
        if (message === "off") {
            setStateBulb(false);
        }
    }

    const _pusblish = (payload) => {

        if (!mqttContext.handlerIsConnected()) {
            Alert.alert(`${appContext.appName}`, "MQTT broker not connected");
            return;
        }
        if (!screenParams.topicPublish) {
            Alert.alert(`${appContext.appName}`, "There is no publish topic configured");
            return;
        }
        mqttContext.handlerPublish(screenParams.topicPublish, payload);
    }

    const _on = () => {
        _pusblish("on");
    }

    const _off = () => {
        _pusblish("off");
    }

    return (
        <View style={styles.container}>

            <HeaderScreen defaultTitle={title} editSetting={true} numberScreen={props.numScreen} />

            <View style={styles.contentIconsBulb}>
                <IconBulb state={stateBulb} />
            </View>

            <View style={styles.contentButtons}>
                <ButtonOnOff type="on" action={_on} />
                <ButtonOnOff type="off" action={_off} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentIconsBulb: {
        marginTop: 100,
        flexGrow: 1,
        alignItems: 'center',
    },

    contentButtons: {
        flexGrow: 2,
        alignItems: 'center',
    }

});

export default OnOff;
