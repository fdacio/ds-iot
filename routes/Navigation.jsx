import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Mqtt from '../screens/Mqtt';
import Settings from '../screens/Settings';
import Weather from "../screens/Weather";

const Tab = createBottomTabNavigator();

const Navigation = () => {

  const _titleDefault = "On/Off";
  const [titleTab1, setTitleTab1] = useState(_titleDefault);
  const [titleTab2, setTitleTab2] = useState(_titleDefault);

  const Mqtt1 = () => (<Mqtt numScreen="1" title={_titleDefault} />);
  const Mqtt2 = () => (<Mqtt numScreen="2" title={_titleDefault} />);

  const _setTitlesTabFromAsyncStorage = async () => {
    console.log("Set titles from async store");

    let title1 = await AsyncStorage.getItem('title-screen1');
    let title2 = await AsyncStorage.getItem('title-screen2');

    if (title1 != null) setTitleTab1(title1);
    if (title2 != null) setTitleTab2(title2);

  }

  useEffect(() => {
    _setTitlesTabFromAsyncStorage();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor='#B5B5B5' style="dark" translucent={false} />
      <SafeAreaView style={styles.container}>
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
          <Tab.Screen name="Mqtt1" component={Mqtt1} options={{ title: titleTab1, headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
          <Tab.Screen name="Mqtt2" component={Mqtt2} options={{ title: titleTab2, headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
          <Tab.Screen name="Weather" component={Weather} options={{ title: 'Weather', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cloud" size={size} color={color} />) }} />
          <Tab.Screen name="Settings" component={Settings} options={{ title: 'Settings', headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cog" size={size} color={color} />) }} />
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