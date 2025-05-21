import { useContext, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppContext from '../context/AppProvider';
import ModalScreen from './ModalScreen';
import TextInputLabel from './TextInputLabel';
import TextInputPasswordLabel from './TextInputPasswordLabel';

const Settings = () => {

    const appContext = useContext(AppContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [brokerMqttHost, setBrokerMqttHost] = useState('');
    const [brokerMqttPort, setBrokerMqttPort] = useState('');
    const [brokerMqttUser, setBrokerMqttUser] = useState('');
    const [brokerMqttPass, setBrokerMqttPass] = useState('');
    const [alertValidate, setAlertValidate] = useState();

    const _onPressEdit = () => {
        setModalVisible(true);
        console.log(true)
    }

    const _onShowModal = async () => {
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

    const _onSave = async () => {

        setAlertValidate({});

        if (!_onValid()) return;

        try {

            const params = {
                "host": brokerMqttHost,
                "port": brokerMqttPort,
                "user": brokerMqttUser,
                "pass": brokerMqttPass
            }

            await appContext.brokerSaveParams(params);

            Alert.alert(`${appContext.appName}`, "Settings broker save with success");

            setModalVisible(false);

        } catch (error) {

            Alert.alert(`${appContext.appName}`, "Error saving settings broker");

        }

    }

    const _onValid = () => {

        let _isValid = true;
        let _alertValidate = {}

        if (!brokerMqttHost) {
            _alertValidate = { ..._alertValidate, 'host': 'Broker Host is required' };
            _isValid = false;
        }
        if (!brokerMqttPort) {
            _alertValidate = { ..._alertValidate, 'port': 'Broker Port is required' };
            _isValid = false;
        }
        if (Number(brokerMqttPort) > 9999) {
            _alertValidate = { ..._alertValidate, 'port': 'Invalid Broker Port' };
            _isValid = false;
        }
        if (!brokerMqttUser) {
            _alertValidate = { ..._alertValidate, 'user': 'Broker User is required' };
            _isValid = false;
        }
        if (!brokerMqttPass) {
            _alertValidate = { ..._alertValidate, 'pass': 'Broker Pass is required' };
            _isValid = false;
        }
        setAlertValidate(_alertValidate);
        return _isValid;
    }

    return (
        <>
            <Pressable onPress={_onPressEdit}>
                <Icon name="cog" color="#ccc" size={24} />
            </Pressable>
            <ModalScreen 
                title="Settings" 
                onShowModal={_onShowModal} 
                visible={modalVisible} 
                setModalVisible={setModalVisible} onSave={_onSave} >

                <TextInputLabel label="Broker MQTT" onChangeText={text => setBrokerMqttHost(text)} value={brokerMqttHost} keyboardType="default" alert={(alertValidate?.host)} />
                <TextInputLabel label="Broker MQTT Port" onChangeText={text => setBrokerMqttPort(text)} value={brokerMqttPort} keyboardType="numeric" alert={alertValidate?.port} />
                <TextInputLabel label="Broker MQTT User" onChangeText={text => setBrokerMqttUser(text)} value={brokerMqttUser} keyboardType="default" alert={alertValidate?.user} />
                <TextInputPasswordLabel label="Broker MQTT Pass" onChangeText={text => setBrokerMqttPass(text)} value={brokerMqttPass} keyboardType="default" alert={alertValidate?.pass} />

            </ModalScreen>
        </>
    );
}


export default Settings;