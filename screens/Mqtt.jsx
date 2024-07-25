import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import ButtonOnOff from '../components/ButtonOnOff';
import IconBulb from '../components/IconBulb';
import MqttService, { 
    mqttServiceLoadConfig, 
    mqttServiceConnect, 
    mqttServicePublish, 
    mqttServiceSetOnMessageArrived, 
    mqttServiceGetPayload, 
    mqttServiceDisconnect } from '../services/mqtt';

//Variáveis de uso global

const Mqtt = (props) => {
    
    const isFocused = useIsFocused();
    const [stateLed, setStateLed] = useState(false);
    const [numScreen, setNumScreen ]= useState();

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

    useEffect(() => {
               
        if (isFocused) {
            
            setNumScreen(props.numScreen);
            MqttService(numScreen);
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

            <Header />

            <HeaderScreen defaultTitle="MQTT" actionSetting={true} actionPostSaveConfig={_onMqttProcessConnect} screenNumber={numScreen} />

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
