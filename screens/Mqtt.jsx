import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import ButtonOnOff from '../components/ButtonOnOff';
import SettingsTopics from '../components/SettingsTopics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MqttService, { mqttServicePublish, mqttServiceSetOnMessageArrived } from '../services/mqtt';

const Mqtt = (props) => {

    const isFocused = useIsFocused();
    const [stateLed, setStateLed] = useState(false);
    const [title, setTitle] = useState(props.title);
    const settingTopicsRef = useRef();

    const _settingShowModal = (numScreen) => {
        if (!settingTopicsRef.current) return;
        settingTopicsRef.current.showModal(numScreen);
    }

    const _setTitleFromStore = async (numScreen) => {
        await AsyncStorage.getItem(`title-screen${numScreen}`)
            .then((title) => {
                if (title != null) {
                    setTitle(title);
                }
            });
    }

    const _postSaveSetting = () => {
        _setTitleFromStore(props.numScreen);
        MqttService(props.numScreen);
    }

    useEffect(() => {
        if (isFocused) {
            console.log("Focus in: " + props.numScreen);
            _setTitleFromStore(props.numScreen);
            MqttService(props.numScreen);
            mqttServiceSetOnMessageArrived((message) => {
                if (message == 'on') setStateLed(true);
                if (message == 'off') setStateLed(false);
            })
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

            <HeaderScreen defaultTitle={title} actionSetting={() => _settingShowModal(props.numScreen)} stateLed={stateLed} />

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

    contentButtons: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default Mqtt;
