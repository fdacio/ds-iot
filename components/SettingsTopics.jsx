import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import TextInputLabel from './TextInputLabel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsTopics = forwardRef((props, ref) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [brokerMqttTopicSubscribe, setBrokerMqttTopicSubscribe] = useState('');
    const [brokerMqttTopicPublish, setBrokerMqttTopicPublish] = useState('');
    const [titleKey, setTitleKey] = useState("");
    const [topicSubscribeKey, setTopicSubscribeKey] = useState("");
    const [topicPublishKey, setTopicPublishKey] = useState("");
    const [alertTitle, setAlertTitle] = useState();
    const [alertSubscribe, setAlertSubscribe] = useState();
    const [alertPublish, setAlertPublish] = useState();

    const publicRef = {
        // add any methods or properties here
        showModal: async (numScreen) => {
            _setKeysStore(numScreen);
            setModalVisible(true);
        }
    };

    useImperativeHandle(ref, () => publicRef);

    const _onSave = async () => {

        _resetAlerts();

        if (!_onValid()) return;

        try {
            await AsyncStorage.setItem(titleKey, title);
            await AsyncStorage.setItem(topicSubscribeKey, brokerMqttTopicSubscribe);
            await AsyncStorage.setItem(topicPublishKey, brokerMqttTopicPublish);
            setModalVisible(false);
            if (props.callBackPostSave != undefined) props.callBackPostSave();
        } catch (error) {
            Alert.alert(`${app.name}`, "Erro ao salvar configuração");
        }
    }

    const _onValid = () => {

        let _isValid = true;

        if ((title == "") || (title == null) || (title == undefined)) {
            setAlertTitle("Title is required");
            _isValid = false;
        }
        if ((brokerMqttTopicSubscribe == "") || (brokerMqttTopicSubscribe == null) || (brokerMqttTopicSubscribe == undefined)) {
            setAlertSubscribe("Topic Subscribe is required");
            _isValid = false;
        }
        if ((brokerMqttTopicPublish == "") || (brokerMqttTopicPublish == null) || (brokerMqttTopicPublish == undefined)) {
            setAlertPublish("Topic Publish is required");
            _isValid = false;
        }

        return _isValid;

    }

    const _onLoadData = async () => {
        
        let title = await AsyncStorage.getItem(titleKey);
        if (title != null) {
            setTitle(title);
        }

        let subscribe = await AsyncStorage.getItem(topicSubscribeKey);
        if (subscribe != null) {
            setBrokerMqttTopicSubscribe(subscribe);
        }

        let publish = await AsyncStorage.getItem(topicPublishKey);
        if (publish != null) {
            setBrokerMqttTopicPublish(publish);
        }

    }

    const _onShowModal = async () => {
        _resetAlerts();
        try {
            _onLoadData();
        } catch (e) {
            Alert.alert(`${app.name}`, "Erro ao carregar configurações");
        }
    }

    const _setKeysStore = (numScreen) => {
        setTitleKey(`title-screen${numScreen}`);
        setTopicSubscribeKey(`broker-mqtt-topic-subscribe${numScreen}`);
        setTopicPublishKey(`broker-mqtt-topic-publish${numScreen}`);    }

    const _resetAlerts = () => {
        setAlertTitle();
        setAlertSubscribe();
        setAlertPublish();
    }

    return (

        <Modal
            visible={modalVisible}
            animationType="none"
            transparent={true}
            onRequestClose={() => setModalVisible(!modalVisible)}
            onShow={_onShowModal}>
            <View style={styles.modalView}>

                <TextInputLabel label="Title" onChangeText={text => setTitle(text)} value={title} keyboardType="default" alert={alertTitle} />
                <TextInputLabel label="Topic Subscribe" onChangeText={text => setBrokerMqttTopicSubscribe(text)} value={brokerMqttTopicSubscribe} keyboardType="default" alert={alertSubscribe} />
                <TextInputLabel label="Topic Publish" onChangeText={text => setBrokerMqttTopicPublish(text)} value={brokerMqttTopicPublish} keyboardType="default" alert={alertPublish} secureTextEntry={true}/>

                <View style={styles.contentPressable}>
                    <Pressable style={[styles.pressableButton]} onPress={() => _onSave()}>
                        <Text style={styles.pressableText}>Save</Text>
                    </Pressable>
                    <View style={styles.pressableSeparator}></View>
                    <Pressable style={[styles.pressableButton]} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.pressableText}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );

});

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

})

export default SettingsTopics;
