// shims
import "@sinonjs/text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";
import "cross-fetch/polyfill";
// ... shims

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./src/navigation/MainStackNavigator";
import { AuthProvider } from "./src/contexts/AuthProvider";
import { ConnectionProvider } from "./src/contexts/ConnectionsProvider";

export default function App() {
  return (
    <AuthProvider>
      <ConnectionProvider>
        <NavigationContainer>
          <MainStackNavigator />
        </NavigationContainer>
      </ConnectionProvider>
    </AuthProvider>
  );
}
