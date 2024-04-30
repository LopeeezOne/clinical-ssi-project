import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import CredentialCard from "../components/CredentialCard"; // Adjust the import path as necessary
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useCredentials } from "../contexts/CredentialsProvider";

interface CredentialsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const CredentialsScreen: React.FC<CredentialsScreenProps> = ({
  navigation,
}) => {
  const { credentials , retrieveCredentials } = useCredentials();

  useEffect(() => {
    retrieveCredentials(); 
  }, [retrieveCredentials]);

  return (
    <View style={styles.container}>
      <FlatList
        data={credentials}
        keyExtractor={(item) => item.hash}
        renderItem={({ item }) => (
          <CredentialCard credentialCard={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default CredentialsScreen;
