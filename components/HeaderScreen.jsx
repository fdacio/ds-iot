import React from 'react';
import { StyleSheet, View, Text, Pressable, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconBulb from '../components/IconBulb';

const HeaderScreen = (props) => {

    return (
        <View style={styles.content}>
            <Text style={styles.title}>{props.defaultTitle}</Text>
            {(props.actionSetting != undefined) &&
            <>
            <View style={styles.contentIconsBulb}>
                <IconBulb state={props.stateLed} />
            </View>
            <View style={styles.contenIconSetting}>
                <Pressable onPress={props.actionSetting}>
                    <Icon name="cog" color="#ccc" size={32} />
                </Pressable>
            </View>
            </>
            }
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
        flex: 1,
        alignItems: 'flex-start',
    },
    contentIconsBulb: {
        marginLeft: 20,
        flex: 1,
        alignItems: 'center',
    },
    contenIconSetting: {
        flex: 1,
        alignItems: 'flex-end',
    },
})

export default HeaderScreen