import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import HeaderScreen from '../components/HeaderScreen';
import TextInputLabel from '../components/TextInputLabel';
import TextInputPasswordLabel from '../components/TextInputPasswordLabel';
import Loading from '../components/Loading';
import Button from '../components/Button';
import AppContext from '../context/AppProvider';

const Settings = (props) => {

    const appContext = useContext(AppContext);
    const isFocused = useIsFocused();

    const [title, setTitle] = useState();
    const [brokerMqttHost, setBrokerMqttHost] = useState('');
    const [brokerMqttPort, setBrokerMqttPort] = useState('');
    const [brokerMqttUser, setBrokerMqttUser] = useState('');
    const [brokerMqttPass, setBrokerMqttPass] = useState('');
    const [alertBrokerMqttHost, setAlertBrokerMqttHost] = useState();
    const [alertBrokerMqttPort, setAlertBrokerMqttPort] = useState();
    const [alertBrokerMqttUser, setAlertBrokerMqttUser] = useState();
    const [alertBrokerMqttPass, setAlertBrokerMqttPass] = useState();
    const [loading, setLoading] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    const defaultLabelButton = "Save";
    const [labelButton, setLabelButton] = useState(defaultLabelButton);

    const _onSaveAndConnect = async () => {

        if (!_onValid()) return;

        setLoading(true);
        setLabelButton("Wait ...");
        setDisabledButton(true);

        try {
            const params = {
                "host" : brokerMqttHost,
                "port" : brokerMqttPort,
                "user" : brokerMqttUser,
                "pass" : brokerMqttPass
            }
   
            await appContext.brokerSaveParams(params);

            Alert.alert(`${appContext.appName}`, "Settings broker save with success");


        } catch (error) {
            Alert.alert(`${appContext.appName}`, "Error saving settings broker");
        } finally {
            setLoading(false);
            setDisabledButton(false);
            setLabelButton(defaultLabelButton);
        }

    }

    const _onValid = () => {

        _resetAlerts();

        let _isValid = true;

        if (!brokerMqttHost) {
            setAlertBrokerMqttHost("Broker Host is required");
            _isValid = false;
        }
        if (!brokerMqttPort) {
            setAlertBrokerMqttPort("Broker Port is required");
            _isValid = false;
        }
        if (Number(brokerMqttPort) > 9999) {
            setAlertBrokerMqttPort("Invalid Broker Port");
            _isValid = false;
        }
        if (!brokerMqttUser) {
            setAlertBrokerMqttUser("Broker User is required");
            _isValid = false;
        }
        if (!brokerMqttPass) {
            setAlertBrokerMqttPass("Broker Pass is required");
            _isValid = false;
        }

        return _isValid;
    }

    const _resetAlerts = () => {
        setAlertBrokerMqttHost();
        setAlertBrokerMqttPort();
        setAlertBrokerMqttUser();
        setAlertBrokerMqttPass();
    }

    useEffect(() => {
        const _loadParam = async () => {
            const paramBroker = await appContext.brokerParamsConnection();
            setTitle(props.title);
            setBrokerMqttHost(paramBroker.host);
            setBrokerMqttPort(paramBroker.port);
            setBrokerMqttUser(paramBroker.user);
            setBrokerMqttPass(paramBroker.pass);
        }
        _loadParam();
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <HeaderScreen defaultTitle={title}  />
            <ScrollView>
                <View style={{ padding: 16, marginBottom: 48 }}>
                    <TextInputLabel label="Broker MQTT" onChangeText={text => setBrokerMqttHost(text)} value={brokerMqttHost} keyboardType="default" alert={alertBrokerMqttHost} />
                    <TextInputLabel label="Broker MQTT Port" onChangeText={text => setBrokerMqttPort(text)} value={brokerMqttPort} keyboardType="numeric" alert={alertBrokerMqttPort} />
                    <TextInputLabel label="Broker MQTT User" onChangeText={text => setBrokerMqttUser(text)} value={brokerMqttUser} keyboardType="default" alert={alertBrokerMqttUser} />
                    <TextInputPasswordLabel label="Broker MQTT Pass" onChangeText={text => setBrokerMqttPass(text)} value={brokerMqttPass} keyboardType="default" alert={alertBrokerMqttPass} />
                    <Button label={labelButton} onPress={_onSaveAndConnect} disabled={disabledButton} />
                </View>
                <Loading loading={loading} />
            </ScrollView>
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