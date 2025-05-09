import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import OnOff from '../screens/OnOff';
import Settings from '../screens/Settings';
import Weather from "../screens/Weather";

const Tab = createBottomTabNavigator();

const Navigation = () => {

  const [titleTab1, setTitleTab1] = useState("On/Off 1");
  const [titleTab2, setTitleTab2] = useState("On/Off 2");
  const [titleTab3, setTitleTab3] = useState("Weather");
  const [titleTab4, setTitleTab4] = useState("Settings");

  const _OnOff1   = () => (<OnOff    numScreen="1" title={"ON/OFF 1"} />);
  const _OnOff2   = () => (<OnOff    numScreen="2" title={"ON/OFF 2"} />);
  const _Weather  = () => (<Weather  numScreen="3" title={"WEATHER"} />)
  const _Settings = () => (<Settings numScreen="4" title={"SETTINGS"} />)

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
          <Tab.Screen name="OnOff1"   component={_OnOff1}   options={{ title: titleTab1, headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
          <Tab.Screen name="OnOff"    component={_OnOff2}   options={{ title: titleTab2, headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="power-off" size={size} color={color} />) }} />
          <Tab.Screen name="Weather"  component={_Weather}  options={{ title: titleTab3, headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cloud" size={size} color={color} />) }} />
          <Tab.Screen name="Settings" component={_Settings} options={{ title: titleTab4, headerShown: false, tabBarIcon: (({ color, size }) => <Icon name="cog" size={size} color={color} />) }} />
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