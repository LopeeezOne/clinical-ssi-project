import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ConnectionsScreen from '../screens/ConnectionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import CredentialsScreen from '../screens/CredentialsScreen';

const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          return (
            <Ionicons
              name={
                route.name === "Home" ? "home" :
                route.name === "Credentials" ? "albums-outline" :
                route.name === "Connections" ? "send" :
                route.name === "Profile" ? "person":
                "home" //Default value in case of fallback
              }
              size={size}
              color={color}
            />
            );
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
      <Tab.Screen name="Credentials" component={CredentialsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;