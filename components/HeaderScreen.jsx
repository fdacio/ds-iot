import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View, Text, Pressable, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconBulb from '../components/IconBulb';

const HeaderScreen = forwardRef((props, ref) => {

    const [stateBulb, setStateBulb] = useState(false);

    const publicRef = {
        updateStateIconBulb: (payload) => {
            console.log("payload HeaderScreen: " + payload);
            setStateBulb(false);
            if (payload == "on") {
                setStateBulb(true);
            } else if (payload == "off") {
                setStateBulb(false);
            }
        }
    }
    useImperativeHandle(ref, () => publicRef);
    
    return (
        <View style={styles.content}>
            <Text style={styles.title}>{props.defaultTitle}</Text>
            {(props.actionSetting != undefined) &&
                <>
                    <View style={styles.contentIconsBulb}>
                        <IconBulb state={stateBulb} />
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
});

const styles = StyleSheet.create({

    content: {
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    title: {
        flex: 3,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'flex-start',
    },
    contentIconsBulb: {
        flex: 1,
        alignItems: 'center',
    },
    contenIconSetting: {
        flex: 3,
        alignItems: 'flex-end',
    },
    contenIconConnection: {
        flex: 1,
        alignItems: 'flex-end',
    },
    iconConnected: {
        color: "#00fa00"
    },
    iconDisconnected: {
        color: "#cccccc"
    }
})

export default HeaderScreen