import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import OnOff from '../screens/OnOff';
import Settings from '../screens/Settings';
import Weather from "../screens/Weather";
import AppContext from '../context/AppProvider';

const Tab = createBottomTabNavigator();

const Navigation = () => {

	const appContext = useContext(AppContext);

	const _OnOff1 = () => (<OnOff numScreen="1" title={"ON/OFF 1"} />);
	const _OnOff2 = () => (<OnOff numScreen="2" title={"ON/OFF 2"} />);
	const _Weather = () => (<Weather numScreen="3" title={"Weather"} />)
	const _Settings = () => (<Settings numScreen="4" title={"Settings"} />)

	return (
		<NavigationContainer>
			<StatusBar backgroundColor='#B5B5B5' style="dark" translucent={false} />
			<SafeAreaView style={styles.container}>
				<Header />
				<Tab.Navigator
					screenOptions={{
						tabBarActiveTintColor: '#000',
						tabBarInactiveTintColor: "#B5B5B5",
						tabBarLabelStyle: {
							fontSize: 18,
							fontFamily: 'arial',
							fontWeight: 'bold'
						},
						tabBarActiveBackgroundColor: '#B5B5B5',
						tabBarStyle: {
							height: 64,
							borderLeftColor: '#B5B5B5',
							borderLeftWidth: 1
						}

					}}>
					<Tab.Screen name="OnOff1" component={_OnOff1} options={{ title: appContext.stateTitles.titles[0], headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
					<Tab.Screen name="OnOff" component={_OnOff2} options={{ title: appContext.stateTitles.titles[1], headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
					<Tab.Screen name="Weather" component={_Weather} options={{ title: appContext.stateTitles.titles[2], headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cloud" size={size} color={color} />) }} />
					<Tab.Screen name="Settings" component={_Settings} options={{ title: "Settings", headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cog" size={size} color={color} />) }} />
				</Tab.Navigator>
			</SafeAreaView>
		</NavigationContainer>
	)
}
const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: "#B5B5B5"
	},

});
export default Navigation;