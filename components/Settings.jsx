import { useContext, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppContext from '../context/AppProvider';
import HeaderScreen from './HeaderScreen';
import Loading from './Loading';
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
    const [loading, setLoading] = useState(false);

    const _onPressEdit = () => {
        setModalVisible(true);
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

        setLoading(true);

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

        } finally {
            setLoading(false);
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
                <Icon name="cog" color="#ccc" size={32} />
            </Pressable>
            <Modal
                visible={modalVisible}
                animationType="none"
                transparent={true}
                onRequestClose={() => setModalVisible(!modalVisible)}
                onShow={_onShowModal}>
                <View style={styles.modalView}>
                    <ScrollView>
                        <Text style={styles.title}>Settings</Text>
                        <TextInputLabel label="Broker MQTT" onChangeText={text => setBrokerMqttHost(text)} value={brokerMqttHost} keyboardType="default" alert={(alertValidate?.host)} />
                        <TextInputLabel label="Broker MQTT Port" onChangeText={text => setBrokerMqttPort(text)} value={brokerMqttPort} keyboardType="numeric" alert={alertValidate?.port} />
                        <TextInputLabel label="Broker MQTT User" onChangeText={text => setBrokerMqttUser(text)} value={brokerMqttUser} keyboardType="default" alert={alertValidate?.user} />
                        <TextInputPasswordLabel label="Broker MQTT Pass" onChangeText={text => setBrokerMqttPass(text)} value={brokerMqttPass} keyboardType="default" alert={alertValidate?.pass} />
                        <View style={styles.contentPressable}>
                            <Pressable style={[styles.pressableButton]} onPress={() => _onSave()}>
                                <Text style={styles.pressableText}>Save</Text>
                            </Pressable>
                            <View style={styles.pressableSeparator}></View>
                            <Pressable style={[styles.pressableButton]} onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.pressableText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                    <Loading loading={loading} />
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        marginTop: 140,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    contentPressable: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
    },

    pressableButton: {
        flex: 1,
        width: '50%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },

    pressableText: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        alignItems: 'center',
    },

    pressableSeparator: {
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        height: '100%',
        width: 1
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 16,
        paddingBottom: 8,
    },
});

export default Settings;