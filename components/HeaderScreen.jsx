import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../context/AppProvider';
import SettingsTopics from './SettingsTopics';

const HeaderScreen = (props) => {
    
    const appContext = useContext(AppContext);
    const title = appContext.stateTitles.titles[props.numberScreen-1];
    return (
        <View style={styles.content}>
            <Text style={styles.title}>{(title) ? title : props.defaultTitle}</Text>

            {(props.editSetting) &&
                <View style={styles.contenIconSetting}>
                    <SettingsTopics numberScreen={props.numberScreen} />
                </View>
            }
        </View>
    );
};

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
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        alignItems: 'flex-start',
    },

    contenIconSetting: {
        flex: 1,
        alignItems: 'flex-end',
    },
})

export default HeaderScreen