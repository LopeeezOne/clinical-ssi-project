// shims
import "@sinonjs/text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";
import "cross-fetch/polyfill";
// ... shims

import * as React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./src/navigation/MainStackNavigator";
import { AuthProvider } from "./src/contexts/AuthProvider";
import { ConnectionProvider } from "./src/contexts/ConnectionsProvider";
import { CredentialProvider } from "./src/contexts/CredentialsProvider";

export default function App() {
  return (
      <ConnectionProvider>
        <AuthProvider>
          <CredentialProvider>
            <NavigationContainer>
              <MainStackNavigator />
            </NavigationContainer>
          </CredentialProvider>
        </AuthProvider>
      </ConnectionProvider>
  );
}
