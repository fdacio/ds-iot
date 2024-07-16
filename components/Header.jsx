import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = (props) => {
    return (
        <View style={styles.content}>
            
                <Icon name="home" color="#fff" size={ 22 } style={styles.iconHome}/>
                <Text style={styles.title}>{props.title}</Text>
                <View style={styles.viewRight}/>
            
        </View>
    );
}

const styles = StyleSheet.create({

    content: {
        backgroundColor: '#201f1f',
        height: 56,
        paddingHorizontal: 8,
        flexDirection: 'row',
    },

    contentBar: {
        
    },

    iconHome: {
        flex: 1,
        alignItems: 'flex-start',
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
        flex: 1
    }
})

export default Header