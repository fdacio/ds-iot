import { useContext, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppContext from '../context/AppProvider';
import ModalScreen from './ModalScreen';
import TextInputLabel from './TextInputLabel';

const SettingsTopics = (props) => {

    const appContext = useContext(AppContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [topicSubscribe, setTopicSubscribe] = useState('');
    const [topicPublish, setTopicPublish] = useState('');
    const [alertTitle, setAlertTitle] = useState();
    const [alertSubscribe, setAlertSubscribe] = useState();
    const [alertPublish, setAlertPublish] = useState();

    const _onPressEdit = () => {
        setModalVisible(true);
    }

    const _onShowModal = async () => {
        const params = await appContext.screenMqttParams(props.numberScreen);
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
                "topicPublish": topicPublish,
                "title": title
            }
            await appContext.screenMqttSaveParams(props.numberScreen, params);
            setModalVisible(false);
            appContext.dispatch(
                {
                    type: "updateTitle",
                    payload: {
                        "n": props.numberScreen,
                        "title":
                            title
                    }
                });
        } catch (error) {
            Alert.alert(`${appContext.appName}`, "Error on save topics settings");
            throw Error(error);
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
            <Pressable onPress={_onPressEdit}>
                <Icon name="edit" color="#ccc" size={32} />
            </Pressable>
            <ModalScreen 
                title="Topics" 
                onShowModal={_onShowModal} 
                visible={modalVisible} 
                setModalVisible={setModalVisible} 
                onSave={_onSave} >

                <TextInputLabel label="Title" onChangeText={text => setTitle(text)} value={title} keyboardType="default" alert={alertTitle} />
                <TextInputLabel label="Topic Subscribe" onChangeText={text => setTopicSubscribe(text)} value={topicSubscribe} keyboardType="default" alert={alertSubscribe} />
                <TextInputLabel label="Topic Publish" onChangeText={text => setTopicPublish(text)} value={topicPublish} keyboardType="default" alert={alertPublish} secureTextEntry={true} />


            </ModalScreen>
        </>
    );

}


export default SettingsTopics;
