import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import HomeScreen from './HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserProfile from './UserProfile';
const Tab = createBottomTabNavigator();

const TabLabel = ({ label, focused }) => {
  return (
    <Text style={{ fontSize: focused ? 20 : 16, color: focused ? 'white' : 'gray' }}>{label}</Text>

  );
};

const BottomTab = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: 'black',
          height: 56,
        },
        tabBarLabelStyle: {
          display: 'none', // Hide default label
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarLabel: ({ focused, color }) => (
          <TabLabel label={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Profile" component={UserProfile} options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  );
};

export default BottomTab;
