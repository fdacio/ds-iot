import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import TextInputLabel from './TextInputLabel';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SettingsTopics = forwardRef((props, ref) => {

    const [numScreen, setNumScreen] = useState();
    const [title, setTitle] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [brokenMqttTopicSubscribe, setBrokenMqttTopicSubscribe] = useState('');
    const [brokenMqttTopicPublish, setBrokenMqttTopicPublish] = useState('');
    const [titleKey, setTitleKey] = useState("");
    const [topicSubscribeKey, setTopicSubscribeKey] = useState("");
    const [topicPublishKey, setTopicPublishKey] = useState("");

    const publicRef = {
        // add any methods or properties here
        showModal: (numScreen) => {
            setNumScreen(numScreen);
            setModalVisible(true);
        }
    };

    useImperativeHandle(ref, () => publicRef);

    const _onSave = async () => {

        try {
            await AsyncStorage.setItem(titleKey, title);
            await AsyncStorage.setItem(topicSubscribeKey, brokenMqttTopicSubscribe);
            await AsyncStorage.setItem(topicPublishKey, brokenMqttTopicPublish);
            Alert.alert("DS-IOT", "Configuração salva com sucesso");
            setModalVisible(false);
            if (props.callBackPostSave != undefined) props.callBackPostSave();
        } catch (error) {
            console.log(error);
            Alert.alert("DS-IOT", "Erro ao salvar configuração");
        }
    }

    const _onShowModal = async () => {

        setTitleKey(`title-screen${numScreen}`);
        setTopicSubscribeKey(`broken-mqtt-topic-subscribe${numScreen}`);
        setTopicPublishKey(`broken-mqtt-topic-publish${numScreen}`);

        await AsyncStorage.getItem(titleKey).then((title) => {
            if (title != null) {
                setTitle(title);
            }
        });
        
        await AsyncStorage.getItem(topicSubscribeKey).then((subscribe) => {
            if (subscribe != null) {
                setBrokenMqttTopicSubscribe(subscribe);
            }
        });

        await AsyncStorage.getItem(topicPublishKey).then((publish) => {
            if (publish != null) {
                setBrokenMqttTopicPublish(publish);
            }
        });
        
    }


    return (

        <Modal
            visible={modalVisible}
            animationType="none"
            transparent={true}
            onRequestClose={() => setModalVisible(!modalVisible)}
            onShow={_onShowModal}>
            <View style={styles.modalView}>

                <TextInputLabel label="Title" onChangeText={text => setTitle(text)} value={title} keyboardType="default" />
                <TextInputLabel label="Topic Subscribe" onChangeText={text => setBrokenMqttTopicSubscribe(text)} value={brokenMqttTopicSubscribe} keyboardType="default" />
                <TextInputLabel label="Topic Publish" onChangeText={text => setBrokenMqttTopicPublish(text)} value={brokenMqttTopicPublish} keyboardType="default" />

                <View style={styles.contentPressable}>
                    <Pressable style={[styles.pressableButton]} onPress={() => _onSave()}>
                        <Text style={styles.pressableText}>Salvar</Text>
                    </Pressable>
                    <View style={styles.pressableSeparator}></View>
                    <Pressable style={[styles.pressableButton]} onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.pressableText}>Cancelar</Text>
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
