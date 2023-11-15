import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import Header from '../components/Header';
import TextInputLabel from '../components/TextInputLabel';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {

    const [ipIot1, setIpIot1] = useState('');
    const [ipIot2, setIpIot2] = useState('');
    
    const _onSave = async () => {
        try {
            await AsyncStorage.setItem("ip-iot-1", ipIot1);
            await AsyncStorage.setItem("ip-iot-2", ipIot2);
            Alert.alert("IPs salvos com sucesso.");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro ao salvar IPs");
        }
    }

    const _loadIpIot1 = async () => {
        let ipIot1 = await AsyncStorage.getItem('ip-iot-1');
        if (ipIot1 != null) {
            console.log(ipIot1);
            setIpIot1(ipIot1);
        }
    }

    const _loadIpIot2 = async () => {
        let ipIot2 = await AsyncStorage.getItem('ip-iot-2');
        if (ipIot2 != null) {
            console.log(ipIot2);
            setIpIot2(ipIot2);
        }
    }

    useEffect(() => {
        _loadIpIot1();
        _loadIpIot2();
    }, []);

    return (
        <View style={styles.container}>
            <Header title="Settings" />
            <View style={{ padding: 16 }}>
                <TextInputLabel label="IP IOT 1" onChangeText={text => setIpIot1(text)} value={ipIot1} keyboardType="default"/>
                <TextInputLabel label="IP IOT 2" onChangeText={text => setIpIot2(text)} value={ipIot2} keyboardType="default"/>
                <Button label="Salvar" onPress={_onSave} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default Settings;