import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import CredentialCard from "../components/CredentialCard"; // Adjust the import path as necessary
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { agent } from "../components/Agent";
import { VerifiableCredential } from "@veramo/core";

interface CredentialsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const CredentialsScreen: React.FC<CredentialsScreenProps> = ({
  navigation,
}) => {
  const [credentials, setCredentials] = useState<CredentialCard[]>([]);

  useEffect(() => {
    const searchCredentials = async () => {
      const newCredentials = await agent.dataStoreORMGetVerifiableCredentials({
        order: [{ column: 'issuanceDate', direction: 'DESC' }]
      });
      
      if (newCredentials.length === 0){
        console.log("There is no new credentials");
      } else if (newCredentials.length !== credentials.length){
        setCredentials(newCredentials);
        console.log("Credentials retrieved: ", newCredentials);
      }
    }
    searchCredentials();// Fetch connections when the component mounts
  }, [credentials]);

  return (
    <View style={styles.container}>
      <FlatList
        data={credentials}
        keyExtractor={(item) => item.verifiableCredential.issuanceDate}
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
  // Additional styles as needed
});

export default CredentialsScreen;
