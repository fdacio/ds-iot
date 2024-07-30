import React, { useState } from 'react'
import { StyleSheet, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Mqtt from './screens/Mqtt';
import Settings from './screens/Settings';

const Tab = createBottomTabNavigator();

const App = () => {
  
  console.log("App init");

  const Mqtt1 = () => (<Mqtt numScreen="1" title="Iot 1" />);
  const Mqtt2 = () => (<Mqtt numScreen="2" title="Iot 2" />);
  const Mqtt3 = () => (<Mqtt numScreen="3" title="Iot 3" />);

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
        <Tab.Screen name="Mqtt1" component={Mqtt1} options={{ title: 'IoT 1', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
        <Tab.Screen name="Mqtt2" component={Mqtt2} options={{ title: 'IoT 2', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
        <Tab.Screen name="Mqtt3" component={Mqtt3} options={{ title: 'IoT 3', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="home" size={size} color={color} />) }} />
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