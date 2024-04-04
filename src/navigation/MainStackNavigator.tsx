import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "../screens/CameraScreen";
import TabNavigator from "./TabNavigator";
import LoginScreen from "../screens/LoginScreen";
import NewConnectionScreen from "../screens/NewConnectionScreen";
import UtilitiesScreen from "../screens/UtilitiesScreen";
import SignUpScreen from "../screens/SignUpScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login"
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="NewConnection" component={NewConnectionScreen} />
      <Stack.Screen name="Utilities" component={UtilitiesScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
