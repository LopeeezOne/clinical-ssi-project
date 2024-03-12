import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import CredentialCard from "../components/CredentialCard"; // Adjust the import path as necessary
import { NavigationProp, ParamListBase } from "@react-navigation/native";

// Sample data
const credentials: CredentialCard[] = [
  {
    id: "1",
    title: "Medical License",
    issuer: "Medical Board",
    issuedDate: "2020-01-01",
    description:
      "This credential verifies the doctor is licensed to practice medicine.",
  },
  // Add more credentials as needed
];

interface CredentialsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const CredentialsScreen: React.FC<CredentialsScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={credentials}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CredentialCard credential={item} navigation={navigation} />
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
  // Additional styles as needed
});

export default CredentialsScreen;
