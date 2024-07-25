import { StyleSheet, View, Text, Pressable, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextInputLabel from '../components/TextInputLabel';

const Settings = () => {
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

export function onSaveSettings(params)  {
    console.log(JSON.stringify(params));
    params.map((item) => console.log(item));
}

export function onLoad()  {

}

export default Settings;