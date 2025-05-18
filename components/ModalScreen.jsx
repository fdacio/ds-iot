import { Modal, ScrollView, Text, View, StyleSheet, Pressable } from "react-native";

const ModalScreen = (props) => {

    return (

        <Modal
            visible={props.visible}
            animationType="none"
            transparent={true}
            onRequestClose={() => props.setModalVisible(!props.visible)}
            onShow={props.onShowModal}>

            <View style={styles.modalView1}>
                <ScrollView>
                    <View style={styles.modalView2}>
                        <Text style={styles.title}>{props.title}</Text>
                        {props.children}

                        <View style={styles.contentPressable}>
                            <Pressable style={[styles.pressableButton]} onPress={() => props.onSave()}>
                                <Text style={styles.pressableText}>Save</Text>
                            </Pressable>
                            <View style={styles.pressableSeparator}></View>
                            <Pressable style={[styles.pressableButton]} onPress={() => props.setModalVisible(!props.visible)}>
                                <Text style={styles.pressableText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({
    modalView1: {
        marginTop: 140,
    },
    
    modalView2: {
        marginHorizontal:20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 16,
        paddingBottom: 8,
    },

    contentPressable: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
    },

    pressableButton: {
        flex: 1,
        width: '50%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },

    pressableText: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        alignItems: 'center',
    },

    pressableSeparator: {
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        height: '100%',
        width: 1
    },
});

export default ModalScreen;