import React, { Component } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "../screens/CameraScreen";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login"
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
