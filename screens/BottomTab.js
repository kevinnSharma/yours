import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme, StyleSheet, TouchableOpacity } from 'react-native';
import HomeScreen from './HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserProfile from './UserProfile';

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  const colorScheme = useColorScheme();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          height: 42
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
        tabBarInactiveTintColor: 'gray',
      })}
    >
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons name="home" color={color} size={focused ? 30 : 24} />
          ),
        }} />
      <Tab.Screen name="Profile" component={UserProfile} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialCommunityIcons name="account" color={color} size={focused ? 30 : 24} />
        ),
      }} />
    </Tab.Navigator>
  );
};

export default BottomTab;
