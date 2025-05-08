import React, {  } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { expo } from '../app.json';
import MqttConnect from './MqttConnect';

const Header = (props) => {

    return (
        <View style={styles.content}>
            <View style={styles.contentLeft}>
                <Icon name="home" color="#fff" size={32} style={styles.iconLeft} />
            </View>
            <View style={styles.contentTitle}>
                <Text style={styles.title}>{expo.name}</Text>
                <Text style={styles.textVersion}>{expo.version}</Text>
            </View>
            <View style={styles.contentRight}>
                {props.showActionConnect &&
                    <>
                        <MqttConnect />
                    </>
                }
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
