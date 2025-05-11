import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderScreen from '../components/HeaderScreen';
import AppContext from '../context/AppProvider';
import MqttContext from '../context/MqttProvider';

const Weather = (props) => {

    const appContext = useContext(AppContext);
    const mqttContext = useContext(MqttContext);
    const isFocused = useIsFocused();

    const [title, setTitle] = useState();
    const [temp, setTemp] = useState(0);
    const [humi, setHumi] = useState(0);

    let topicSubscribe;

    useEffect(() => {
        if (isFocused) {
            const load = async () => {
                const params = await appContext.screenMqttParams(props.numScreen);
                setTitle((params.title) ? params.title : props.title);
                topicSubscribe = params.topicSubscribe;
                if (topicSubscribe == null) {
                    Alert.alert(`${appContext.appName}`, "There is no subscribe topic configured");
                    return;
                }
                mqttContext.handlerPostConnected(() => mqttContext.handlerListenerSubscribe(topicSubscribe, updateTempHumi));
                mqttContext.handlerListenerSubscribe(topicSubscribe, updateTempHumi);
            }
            load();
        }
    }, [isFocused]);

    const alert = () => {

    }

    const updateTempHumi = (response) => {
        if (response) {
            let dado = JSON.parse(response);
            setTemp(Math.floor(dado.temp));
            setHumi(Math.floor(dado.humi));
        }
    }

    return (

        <View style={styles.container}>
            <HeaderScreen defaultTitle={title} editSetting={true} numberScreen={props.numScreen} />
            <ScrollView>
                <View style={styles.containerDados}>
                    <View style={styles.contentDados}>
                        <View style={styles.contentHeader}>
                            <Text style={[styles.contentHeaderTitle, styles.colorTemp]}>Temperature</Text>
                            <Icon name="thermometer" size={32} style={styles.colorTemp} />
                        </View>
                        <View style={styles.contentMain}>
                            <Text style={styles.textMainPrimary}>{temp}</Text>
                            <Text style={styles.textMainSecundary}>°C</Text>
                        </View>
                    </View>
                    <View style={styles.contentDados}>
                        <View style={styles.contentHeader}>
                            <Text style={[styles.contentHeaderTitle, styles.colorHumi]}>Humidity</Text>
                            <Icon name="tint" size={32} style={styles.colorHumi} />
                        </View>
                        <View style={styles.contentMain}>
                            <Text style={styles.textMainPrimary}>{humi}</Text>
                            <Text style={styles.textMainSecundary}>%</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    containerDados: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 32,
    },

    contentDados: {
        width: 240,
        height: 240,
        margin: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },

    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginHorizontal: 4,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },

    contentHeaderTitle: {
        fontWeight: 'bold',
        fontSize: 24,
    },

    colorTemp: {
        color: '#008f00'
    },

    colorHumi: {
        color: '#0000ff'
    },

    contentMain: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    textMainPrimary: {
        fontWeight: 'bold',
        fontSize: 64,
    },

    textMainSecundary: {
        fontWeight: 'bold',
        fontSize: 48,
    }

});

export default Weather;
