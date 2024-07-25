import React from 'react'
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Mqtt1 from './screens/mqtt1';
import Mqtt2 from './screens/mqtt2';
import Mqtt3 from './screens/mqtt3';
import Settings from './screens/settings';

const Tab = createBottomTabNavigator();

const App = () => {

  console.log("App init");
  
  return (

    <NavigationContainer>
      <StatusBar backgroundColor='#878787' />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: "#B5B5B5",
          tabBarLabelStyle: {
            fontSize: 18,
            marginBottom: 4,
            fontWeight: 'bold'
          },
          tabBarActiveBackgroundColor: '#B5B5B5',
          tabBarStyle: {
            height: 65,
            borderLeftColor: '#B5B5B5',
            borderLeftWidth: 1
          }

        }}>
        <Tab.Screen name="Mqtt1" component={Mqtt1} options={{ title: 'MQTT 1', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
        <Tab.Screen name="Mqtt2" component={Mqtt2} options={{ title: 'MQTT 2', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
        <Tab.Screen name="Mqtt3" component={Mqtt3} options={{ title: 'MQTT 3', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
        <Tab.Screen name="Settings" component={Settings} options={{ title: 'Settings', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cog" size={size} color={color} />) }} />
      </Tab.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;