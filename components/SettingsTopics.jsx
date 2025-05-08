import React, { useState, forwardRef, useImperativeHandle, useEffect, useContext } from 'react';
import { Modal, View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import TextInputLabel from './TextInputLabel';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppContext from '../context/AppProvider';

const SettingsTopics = (props) => {

    const appContext = useContext(AppContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [topicSubscribe, setTopicSubscribe] = useState('');
    const [topicPublish, setTopicPublish] = useState('');
    const [alertTitle, setAlertTitle] = useState();
    const [alertSubscribe, setAlertSubscribe] = useState();
    const [alertPublish, setAlertPublish] = useState();
    
    const showEditSetting = () => {
        setModalVisible(true);
    }
    
    const _onShowModal = () => {
        const params = appContext.screenMqttParams(props.numberScreen);
        setTitle(params.title);
        setTopicPublish(params.topicPublish);
        setTopicSubscribe(params.topicSubscribe);
        _resetAlerts();
    }

    const _onSave = async () => {

        _resetAlerts();

        if (!_onValid()) return;

        try {
            const params = {
                "topicSubscribe": topicSubscribe,
                "topicPublis": topicPublish,
                "title": title
            }
            appContext.screenMqttSaveParams(props.numScreen, params);
            setModalVisible(false);
        } catch (error) {
            Alert.alert(`${app.name}`, "Error on save topics settings");
        }
    }

    const _onValid = () => {

        let _isValid = true;

        if (!title) {
            setAlertTitle("Title is required");
            _isValid = false;
        }
        if (!topicSubscribe) {
            setAlertSubscribe("Topic Subscribe is required");
            _isValid = false;
        }
        if (!topicPublish) {
            setAlertPublish("Topic Publish is required");
            _isValid = false;
        }

        return _isValid;

    }


    const _resetAlerts = () => {
        setAlertTitle("");
        setAlertSubscribe("");
        setAlertPublish("");
    }

    return (
        <>
            <Pressable onPress={showEditSetting}>
                <Icon name="edit" color="#ccc" size={32} />
            </Pressable>

            <Modal
                visible={modalVisible}
                animationType="none"
                transparent={true}
                onRequestClose={() => setModalVisible(!modalVisible)}
                onShow={_onShowModal}>
                <View style={styles.modalView}>

                    <TextInputLabel label="Title" onChangeText={text => setTitle(text)} value={title} keyboardType="default" alert={alertTitle} />
                    <TextInputLabel label="Topic Subscribe" onChangeText={text => setBrokerMqttTopicSubscribe(text)} value={topicSubscribe} keyboardType="default" alert={alertSubscribe} />
                    <TextInputLabel label="Topic Publish" onChangeText={text => setBrokerMqttTopicPublish(text)} value={topicPublish} keyboardType="default" alert={alertPublish} secureTextEntry={true} />

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

})

export default SettingsTopics;
