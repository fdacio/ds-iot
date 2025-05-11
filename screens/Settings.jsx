import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import HeaderScreen from '../components/HeaderScreen';
import Loading from '../components/Loading';
import TextInputLabel from '../components/TextInputLabel';
import TextInputPasswordLabel from '../components/TextInputPasswordLabel';
import AppContext from '../context/AppProvider';

const Settings = () => {

    const appContext = useContext(AppContext);
    const isFocused = useIsFocused();

    const [brokerMqttHost, setBrokerMqttHost] = useState('');
    const [brokerMqttPort, setBrokerMqttPort] = useState('');
    const [brokerMqttUser, setBrokerMqttUser] = useState('');
    const [brokerMqttPass, setBrokerMqttPass] = useState('');
    const [alertValidate, setAlertValidate] = useState();
    const [loading, setLoading] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    const defaultLabelButton = "Save";
    const [labelButton, setLabelButton] = useState(defaultLabelButton);


    useEffect(() => {
        if (isFocused) {
            const _loadParam = async () => {
                const paramBroker = await appContext.brokerParamsConnection();
                setBrokerMqttHost(paramBroker.host);
                setBrokerMqttPort(paramBroker.port);
                setBrokerMqttUser(paramBroker.user);
                setBrokerMqttPass(paramBroker.pass);
            }
            _loadParam();
            setAlertValidate({});
        }
    }, [isFocused]);


    const _onSaveAndConnect = async () => {

        setAlertValidate({});

        if (!_onValid()) return;

        setLoading(true);
        setLabelButton("Wait ...");
        setDisabledButton(true);

        try {

            const params = {
                "host": brokerMqttHost,
                "port": brokerMqttPort,
                "user": brokerMqttUser,
                "pass": brokerMqttPass
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

        let _isValid = true;
        let _alertValidate = {}

        if (!brokerMqttHost) {
            _alertValidate = {..._alertValidate , 'host' : 'Broker Host is required'};
            _isValid = false;
        }
        if (!brokerMqttPort) {
            _alertValidate = {..._alertValidate, 'port' : 'Broker Port is required'};
            _isValid = false;
        }
        if (Number(brokerMqttPort) > 9999) {
            _alertValidate = {... _alertValidate, 'port' : 'Invalid Broker Port'};
            _isValid = false;
        }
        if (!brokerMqttUser) {
            _alertValidate = {... _alertValidate, 'user' : 'Broker User is required'};
            _isValid = false;
        }
        if (!brokerMqttPass) {
            _alertValidate = {... _alertValidate, 'pass' : 'Broker Pass is required'};
            _isValid = false;
        }
        setAlertValidate(_alertValidate);
        return _isValid;
    }

    return (
        <View style={styles.container}>
            <HeaderScreen defaultTitle="Settings" />
            <ScrollView>
                <View style={{ padding: 16, marginBottom: 48 }}>
                    <TextInputLabel label="Broker MQTT" onChangeText={text => setBrokerMqttHost(text)} value={brokerMqttHost} keyboardType="default" alert={(alertValidate?.host)} />
                    <TextInputLabel label="Broker MQTT Port" onChangeText={text => setBrokerMqttPort(text)} value={brokerMqttPort} keyboardType="numeric" alert={alertValidate?.port} />
                    <TextInputLabel label="Broker MQTT User" onChangeText={text => setBrokerMqttUser(text)} value={brokerMqttUser} keyboardType="default" alert={alertValidate?.user} />
                    <TextInputPasswordLabel label="Broker MQTT Pass" onChangeText={text => setBrokerMqttPass(text)} value={brokerMqttPass} keyboardType="default" alert={alertValidate?.pass} />
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