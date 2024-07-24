import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const HeaderScreen = (props) => {
    return (
        <View style={styles.content}>
            <Text style={styles.title}>{props.title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },

})

export default HeaderScreen