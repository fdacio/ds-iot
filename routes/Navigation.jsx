import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mqtt from '../screens/Mqtt';
import Weather from "../screens/Weather";
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

const Navigation = () => {

  const _titleDefault = "On/Off";
  const [titleTab1, setTitleTab1] = useState(_titleDefault);
  const [titleTab2, setTitleTab2] = useState(_titleDefault);

  const Mqtt1 = () => (<Mqtt numScreen="1" title={ _titleDefault } />);
  const Mqtt2 = () => (<Mqtt numScreen="2" title={ _titleDefault } />);

  const _setTitlesTabFromAsyncStorage = async () => {
    console.log("Set titles from async store");

    let title1 = await AsyncStorage.getItem('title-screen1');
    let title2 = await AsyncStorage.getItem('title-screen2');

    if (title1 != null) setTitleTab1(title1);
    if (title2 != null) setTitleTab2(title2);

  }

  const _setTitleTabByNumScreen = async (numScreen) => {
    let title = await AsyncStorage.getItem(`title-screen${numScreen}`);
  }

  useEffect(() => {
    _setTitlesTabFromAsyncStorage();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor='#878787' />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: "#B5B5B5",
          tabBarLabelStyle: {
            fontSize: 16,
            marginBottom: 4,
            fontWeight: 'bold'
          },
          tabBarActiveBackgroundColor: '#B5B5B5',
          tabBarStyle: {
            height: 64,
            borderLeftColor: '#B5B5B5',
            borderLeftWidth: 1
          }

        }}>
        <Tab.Screen name="Mqtt1" component={Mqtt1} options={{ title: titleTab1, headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
        <Tab.Screen name="Mqtt2" component={Mqtt2} options={{ title: titleTab2, headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
        <Tab.Screen name="Weather" component={Weather} options={{ title: 'Weather', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cloud" size={size} color={color} />) }} />
        <Tab.Screen name="Settings" component={Settings} options={{ title: 'Settings', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cog" size={size} color={color} />) }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;