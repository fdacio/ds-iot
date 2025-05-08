import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppContext from '../context/AppProvider';
import MqttConnect from './MqttConnect';

const Header = (props) => {

    const appContext = useContext(AppContext);

    return (
        <View style={styles.content}>
            <View style={styles.contentLeft}>
                <Icon name="home" color="#fff" size={32} style={styles.iconLeft} />
            </View>
            <View style={styles.contentTitle}>
                <Text style={styles.title}>{appContext.appName}</Text>
                <Text style={styles.textVersion}>{appContext.appVersion}</Text>
            </View>
            <View style={styles.contentRight}>
                <MqttConnect />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        backgroundColor: '#201f1f',
        height: 56,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    contentLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },

    contentTitle: {
        flex: 1,
        alignItems: 'center',
    },

    contentRight: {
        flex: 1,
        alignItems: 'flex-end',
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    textVersion: {
        fontSize: 8,
        color: '#ccc',
    },

})

export default Header
