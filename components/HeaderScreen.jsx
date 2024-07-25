import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputLabel from './TextInputLabel';

const HeaderScreen = (props) => {

    const [title, setTitle] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [brokenMqttTopicSubscribe, setBrokenMqttTopicSubscribe] = useState('');
    const [brokenMqttTopicPublish, setBrokenMqttTopicPublish] = useState('');
    const [titleKey, setTitleKey] = useState("");
    const [topicSubscribeKey, setTopicSubscribeKey] = useState("");
    const [topicPublishKey, setTopicPublishKey] = useState("");

    const _onSave = async () => {
        
        try {
            await AsyncStorage.setItem(titleKey, title);
            await AsyncStorage.setItem(topicSubscribeKey, brokenMqttTopicSubscribe);
            await AsyncStorage.setItem(topicPublishKey, brokenMqttTopicPublish);
            props.actionPostSaveConfig();
            Alert.alert("DS-IOT", "Configuração salva com sucesso");
            setModalVisible(false);
        } catch (error) {
            console.log(error);
            Alert.alert("DS-IOT", "Erro ao salvar configuração");
        }
    }

    const _showModal = async () => {

        let brokenMqttTopicSubscribe = await AsyncStorage.getItem(topicSubscribeKey);
        if (brokenMqttTopicSubscribe != null) {
            setBrokenMqttTopicSubscribe(brokenMqttTopicSubscribe);
        }

        let brokenMqttTopicPublish = await AsyncStorage.getItem(topicPublishKey);
        if (brokenMqttTopicPublish != null) {
            setBrokenMqttTopicPublish(brokenMqttTopicPublish);
        }
    }

    const _loadTitle = async () => {

        let title = await AsyncStorage.getItem(titleKey);
        if (title != null) {
            setTitle(title);
        } else {
            setTitle(props.defaultTitle);            
        }
    }

    useEffect(() => {
        setTitleKey(`title-screen${props.screenNumber}`);
        setTopicSubscribeKey(`broken-mqtt-topic-subscribe${props.screenNumber}`);
        setTopicPublishKey(`broken-mqtt-topic-publish${props.screenNumber}`);
        _loadTitle();
    }, []);

    return (
        <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {(props.actionSetting) &&
                <Pressable onPress={() => setModalVisible(!modalVisible)}>
                    <Icon name="cog" color="#ccc" size={32} />
                </Pressable>
            }
            <Modal
                visible={modalVisible}
                animationType="none"
                transparent={true}
                onRequestClose={() => setModalVisible(!modalVisible)}
                onShow={_showModal}>
                <View style={styles.modalView}>

                    <TextInputLabel label="Screen Title" onChangeText={text => setTitle(text)} value={title} keyboardType="default" />
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
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        flexDirection: 'row',
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },

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
        width: '50%',
        alignItems: 'center',
    },

    pressableText: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    pressableSeparator: {
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        height: '100%',
        width: 1
    },

})

export default HeaderScreen