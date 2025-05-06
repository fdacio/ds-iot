import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import ButtonOnOff from '../components/ButtonOnOff';
import SettingsTopics from '../components/SettingsTopics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { expo } from '../app.json';

import MqttService, {
    mqttServicePublish,
    mqttServiceSetOnMessageArrived,
    mqttServiceStatusConnected,
    mqttServiceHasTopicPublish
} from '../services/mqtt';

const Mqtt = (props) => {

    const isFocused = useIsFocused();
    const [title, setTitle] = useState(props.title);
    const settingTopicsRef = useRef();
    const headerRef = useRef();
    const headerScreenRef = useRef();

    useEffect(() => {
        if (isFocused) {
            _setTitleFromStore(props.numScreen);
            MqttService(props.numScreen);
            mqttServiceSetOnMessageArrived((payload) => {
                _onUpdateStateBulb(payload)
            });
            _onUpdateStatusBarConnection(mqttServiceStatusConnected());
        }
    }, [isFocused]);

    const _settingTopicsShowModal = () => {
        if (!settingTopicsRef.current) return;
        settingTopicsRef.current.showModal(props.numScreen);
    }

    const _onUpdateStatusBarConnection = (status) => {
        if (!headerRef.current) return;
        headerRef.current.updateStateConneticon(status)
    }

    const _onUpdateStateBulb = (message) => {
        if (!headerScreenRef.current) return;
        headerScreenRef.current.updateStateIconBulb(message)
    }

    const _setTitleFromStore = async (numScreen) => {
        let title = await AsyncStorage.getItem(`title-screen${numScreen}`);
        if (title != null) {
            setTitle(title);
        }
    }

    const _postSaveSetting = () => {
        _setTitleFromStore(props.numScreen);
        MqttService(props.numScreen);
    }

    const _pusblish = (payload) => {
        if (!mqttServiceStatusConnected()) {
            Alert.alert(`${expo.name}`, "MQTT broker not connected.");
            _onUpdateStatusBarConnection(false);
            return;
        }
        if (!mqttServiceHasTopicPublish()) {
            Alert.alert(`${expo.name}`, "There is no configured publish topic.");
            return;
        }
        mqttServicePublish(payload);
    }

    const _on = () => {
        _pusblish("on");
    }

    const _off = () => {
        _pusblish("off");
    }

    return (
        <View style={styles.container}>

            <SettingsTopics ref={settingTopicsRef} callBackPostSave={_postSaveSetting} />

            <Header ref={headerRef} showActionConnect={true} />

            <HeaderScreen ref={headerScreenRef} onoff={true} defaultTitle={title} actionSetting={_settingTopicsShowModal} />

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

    contentButtons: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default Mqtt;
