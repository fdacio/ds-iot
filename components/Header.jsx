import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = () => {
    return (
        <View style={styles.content}>
            <Icon name="home" color="#fff" size={32} style={styles.iconHome} />
            <Text style={styles.title}>DS-IOT</Text>
            <View style={styles.viewRight}></View>
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        flexDirection: 'row',
        backgroundColor: '#201f1f',
        height: 56,
        paddingHorizontal: 8,
    },

    iconHome: {
        flex: 1,
        textAlign: 'left',
        alignSelf: 'center',
    },

    title: {
        flex: 2,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'center',
        textAlign: 'center',
        width: '100%',
    },

    viewRight: {
        flex: 1,
        textAlign: 'right',
        alignSelf: 'center',
    }
})

export default Header