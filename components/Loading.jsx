import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = (props) => {
    return (
        <View style={Styles.container}>
            {props.loading && <ActivityIndicator color="#000" size={80} />}
        </View>
    );
}
const Styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center'
    }
});

export default Loading;