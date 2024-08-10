import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mqtt from '../screens/Mqtt';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

const Navigation = () => {

  let _titles = ["On/Off", "On/Off", "On/Off"];
  const [titles, setTitles] = useState(_titles);

  const Mqtt1 = () => (<Mqtt numScreen="1" title={_titles[0]} />);
  const Mqtt2 = () => (<Mqtt numScreen="2" title={_titles[1]} />);
  const Mqtt3 = () => (<Mqtt numScreen="3" title={_titles[2]} />);

  const _setTitlesNavigationFromAsyncStorage = async () => {
    let title1 = await AsyncStorage.getItem('title-screen1');
    if (title1 != null) {
      _titles[0] = title1;
    }
    let title2 = await AsyncStorage.getItem('title-screen2');
    if (title2 != null) {
      _titles[1] = title2;
    }
    let title3 = await AsyncStorage.getItem('title-screen3');
    if (title3 != null) {
      _titles[2] = title3;
    }
    console.log("call from async store");
    console.log(_titles);
    setTitles(_titles);
  }

  const _setTitleTabByNumScreen = async (numScreen) => {
    let title = await AsyncStorage.getItem(`title-screen${numScreen}`);
    if (title != null) {
      _titles[(numScreen - 1)] = title;
    }
    setTitles(_titles);
  }

  useEffect(() => {
    _setTitlesNavigationFromAsyncStorage();
  }, [_titles]);

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
        <Tab.Screen name="Mqtt1" component={Mqtt1} options={{ title: titles[0], headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
        <Tab.Screen name="Mqtt2" component={Mqtt2} options={{ title: titles[1], headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
        <Tab.Screen name="Mqtt3" component={Mqtt3} options={{ title: titles[2], headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
        <Tab.Screen name="Settings" component={Settings} options={{ title: 'Settings', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cog" size={size} color={color} />) }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;