import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import ButtonOnOff from '../components/ButtonOnOff';
import IconBulb from '../components/IconBulb';
import SettingsTopics from '../components/SettingsTopics';

import MqttService, {
    mqttServiceLoadConfig,
    mqttServiceConnect,
    mqttServicePublish,
    mqttServiceSetOnMessageArrived,
    mqttServiceGetPayload,
    mqttServiceDisconnect
} from '../services/mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Variáveis de uso global
const Mqtt = (props) => {

    console.log("render");

    const isFocused = useIsFocused();
    const [stateLed, setStateLed] = useState(false);
    const [numScreen, setNumScreen] = useState();
    const [title, setTitle] = useState("");
    const settingTopicsRef = useRef();

    const settingShowModal = (numScreen) => {
        if (!settingTopicsRef.current) return;
        settingTopicsRef.current.showModal(numScreen);
    }

    const _onMqttProcessConnect = () => {

        mqttServiceLoadConfig().then((hasConfig) => {
            if (hasConfig) {
                mqttServiceConnect();
                mqttServiceSetOnMessageArrived(() => {
                    console.log("Led: " + mqttServiceGetPayload());
                    if (mqttServiceGetPayload() === "on") {
                        setStateLed(true);
                    } else if (mqttServiceGetPayload() == "off") {
                        setStateLed(false);
                    }
                })
            }
        });
    }

    const _setTitleFromStore = async (numScreen) => {
        await AsyncStorage.getItem(`title-screen${numScreen}`)
            .then((title) => {
                if (title != null) {
                    setTitle(title);
                } else {
                    setTitle("Mqtt " + numScreen);
                }
            });
    }

    const _postSaveSetting = () => {
        _setTitleFromStore(numScreen);
        _onMqttProcessConnect();
    }

    useEffect(() => {
        if (isFocused) {
            setNumScreen(props.numScreen);
            MqttService(props.numScreen);
            _setTitleFromStore(props.numScreen);
            _onMqttProcessConnect();
        } else {
            mqttServiceDisconnect();
        }
    }, [isFocused]);

    const _on = () => {
        mqttServicePublish("on");
    }

    const _off = () => {
        mqttServicePublish("off");
    }

    return (
        <View style={styles.container}>

            <SettingsTopics ref={settingTopicsRef} callBackPostSave={_postSaveSetting} />

            <Header />

            <HeaderScreen defaultTitle={title} actionSetting={() => settingShowModal(numScreen)} />

            <View style={styles.contentIconsBulb}>
                <IconBulb state={stateLed} />
            </View>

            <View style={styles.contentButtons}>
                <ButtonOnOff tipo="on" action={_on} />
                <ButtonOnOff tipo="off" action={_off} />
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
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'flex-end',
    },

    contentButtons: {
        justifyContent: 'center',
        alignItems: 'center',
    }

});

export default Mqtt;
