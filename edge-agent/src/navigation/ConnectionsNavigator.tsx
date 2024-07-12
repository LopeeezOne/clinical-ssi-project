import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "../screens/CameraScreen";
import NewConnectionScreen from "../screens/NewConnectionScreen";
import ConnectionsScreen from "../screens/ConnectionsScreen";

const Stack = createNativeStackNavigator<ConnectionsStackParamList>();

const ConnectionsStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ConnectionList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ConnectionList" component={ConnectionsScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="NewConnection" component={NewConnectionScreen} />
    </Stack.Navigator>
  );
};

export default ConnectionsStackNavigator;
