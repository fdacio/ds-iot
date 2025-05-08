import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { expo } from '../app.json';
import ButtonOnOff from '../components/ButtonOnOff';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import SettingsTopics from '../components/SettingsTopics';
import AppContext from '../context/AppProvider';
import MqttContext from '../context/MqttProvider';

const Mqtt = (props) => {

    const appContext = useContext(AppContext);
    const mqttContext = useContext(MqttContext);
    const isFocused = useIsFocused();

    const [topicSubscribe, setTopicSubscribe] = useState("");
    const [topicPublish, setTopicPublish] = useState("");
    const [title, setTitle] = useState(props.title);
    const [stateBulb, setStateBulb] = useState(false);
    
    useEffect(() => {
        if (isFocused) {
            const params = appContext.screenMqttParams(props.numScreen);
            setTopicPublish(params.topicPublish);
            setTopicSubscribe(params.topicSubscribe);
            setTitle(params.setTitle);
        }
    }, [isFocused]);


    const _pusblish = (payload) => {

        if (!mqttContext.isConnected) {
            Alert.alert(`${expo.name}`, "MQTT broker not connected.");
            _onUpdateStatusBarConnection(false);
            return;
        }
        if (topicPublish === '') {
            Alert.alert(`${expo.name}`, "There is no configured publish topic.");
            return;
        }
        mqttContext.handlerPublish(topicPublish, payload);
    }

    const _on = () => {
        _pusblish("on");
    }

    const _off = () => {
        _pusblish("off");
    }

    return (
        <View style={styles.container}>

            <SettingsTopics numScreen={props.numScreen}/>

            <Header showActionConnect={true} />

            <HeaderScreen onoff={true} defaultTitle={title} actionSetting={_settingTopicsShowModal} />
            
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
        flex: 1,
        alignItems: 'center',
    },

    contentButtons: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default Mqtt;
