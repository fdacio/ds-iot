import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from '../components/Header';
import AppContext from '../context/AppProvider';
import OnOff from '../screens/OnOff';
import Settings from '../screens/Settings';
import Weather from "../screens/Weather";

const Tab = createBottomTabNavigator();

const Navigation = () => {

	const appContext = useContext(AppContext);

	const _OnOff1 = () => (<OnOff numScreen="1" />);
	const _OnOff2 = () => (<OnOff numScreen="2" />);
	const _Weather = () => (<Weather numScreen="3" />)
	const _Settings = () => (<Settings numScreen="4" />)

	const tabs = [
		{ name: "OnOff1", component: _OnOff1, title: appContext.state.titles[0], icon: "power-off" },
		{ name: "OnOff2", component: _OnOff2, title: appContext.state.titles[1], icon: "power-off" },
		{ name: "Weather", component: _Weather, title: appContext.state.titles[2], icon: "cloud-sun-rain" },
		{ name: "Settings", component: _Settings, title: "Settings", icon: "cog", },
	];

	const getTabNavigatorStyles = () => {
		return {
			tabBarActiveTintColor: '#000',
			tabBarInactiveTintColor: "#B5B5B5",
			tabBarLabelStyle: {
				fontSize: 18,
				fontFamily: 'arial',
				fontWeight: 'bold',
				paddingBottom: 4,
			},
			tabBarActiveBackgroundColor: '#B5B5B5',
			tabBarStyle: {
				height: 64,
				borderLeftColor: '#B5B5B5',
				borderLeftWidth: 1,
				paddingBottom: 0,
			}
		};
	};

	return (
		<NavigationContainer>
			<StatusBar backgroundColor='#B5B5B5' style="dark" translucent={false} />
			<SafeAreaView style={styles.container}>
				<Header />
				<Tab.Navigator
					screenOptions={getTabNavigatorStyles}>
					{tabs.map((tab, index) => (
						<Tab.Screen
							key={index}
							name={tab.name}
							component={tab.component}
							options={{
								title: tab.title,
								tabBarIcon: ({ color, size }) => <Icon name={tab.icon} size={size} color={color} />,
								headerShown: false
							}}
						/>
					))}
				</Tab.Navigator>
			</SafeAreaView>
		</NavigationContainer>
	)

}
const styles = StyleSheet.create({

	container: {
		flex: 1
	},

});


export default Navigation;