import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import HeaderScreen from '../components/HeaderScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsTopics from '../components/SettingsTopics';


import MqttService, { mqttServicePublish,
    mqttServiceSetOnMessageArrived, 
    mqttServiceStatusConnected } from '../services/mqtt';

const Weather = (props) => {
    const numScreen = 3;
    const isFocused = useIsFocused();
    const [title, setTitle] = useState("Weather");
    const [temp, setTemp] = useState(0);
    const [humi, setHumi] = useState(0);
    const settingTopicsRef = useRef();
    const headerRef = useRef();   
    const headerScreenRef = useRef();

    const _settingTopicsShowModal = () => {
        if (!settingTopicsRef.current) return;
        settingTopicsRef.current.showModal(numScreen);
    }
    
    useEffect(() => {
        if (isFocused) {
            MqttService(numScreen);
            mqttServiceSetOnMessageArrived((payload) => {
                _onUpdateTempHumi(payload)
            });
            _onUpdateStatusBarConnection(mqttServiceStatusConnected());
        } 
    }, [isFocused]);

    const _onUpdateTempHumi = (response) => {
        if (response != '') {
            let dado = JSON.parse(response);
            setTemp(Math.floor(dado.temp));
            setHumi(Math.floor(dado.humi));
        }
    }
    
    const _postSaveSetting = () => {
        MqttService(props.numScreen);
    }

    const _onUpdateStatusBarConnection = (status) => {
        if (!headerRef.current) return;
        headerRef.current.updateStateConneticon(status)
    }

    return (

        <SafeAreaView style={styles.container}>

            <SettingsTopics ref={settingTopicsRef} callBackPostSave={_postSaveSetting} />

            <Header ref={headerRef} showActionConnect={true}/>

            <HeaderScreen ref={headerScreenRef} defaultTitle={title} actionSetting={_settingTopicsShowModal}  />

            <View style={styles.containerDados}>
                <View style={styles.contentDados}>
                    <View style={styles.contentHeader}> 
                        <Text style={[styles.contentHeaderTitle, styles.colorTemp]}>Temperature</Text>
                        <Icon name="thermometer" size={32} style={styles.colorTemp}/>
                    </View>
                    <View style={styles.contentMain}> 
                        <Text style={styles.textMainPrimary}>{temp}</Text>
                        <Text style={styles.textMainSecundary}>°C</Text>
                    </View>
                </View>
                <View style={styles.contentDados}>
                    <View style={styles.contentHeader}> 
                        <Text style={[styles.contentHeaderTitle, styles.colorHumi]}>Humidity</Text>
                        <Icon name="tint" size={32} style={styles.colorHumi}/>
                    </View>
                    <View style={styles.contentMain}> 
                        <Text style={styles.textMainPrimary}>{humi}</Text>
                        <Text style={styles.textMainSecundary}>%</Text>
                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    containerDados: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    contentDados: {
        width: 240,
        height: 240,
        margin: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,       
    },

    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginHorizontal:4,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },

    contentHeaderTitle: {
        fontWeight: 'bold',
        fontSize: 24,
    },

    colorTemp:{
        color: '#008f00'
    },

    colorHumi:{
        color: '#0000ff'
    },

    contentMain: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textMainPrimary: {
        fontWeight: 'bold',
        fontSize: 64,
    },

    textMainSecundary: {
        fontWeight: 'bold',
        fontSize: 48,
    }

});

export default Weather;
