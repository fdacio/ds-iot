import React from 'react'
import { StyleSheet, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iot1 from './screens/iot1';
import Iot2 from './screens/iot2';
import Mqtt from './screens/mqtt';
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
        <Tab.Screen name="Iot1" component={Iot1} options={{ title: 'IOT 1', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
        <Tab.Screen name="Iot2" component={Iot2} options={{ title: 'IOT 2', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
        <Tab.Screen name="Mqtt" component={Mqtt} options={{ title: 'MQTT', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
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