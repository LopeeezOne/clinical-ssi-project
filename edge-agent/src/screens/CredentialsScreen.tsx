import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, Text, ImageBackground } from "react-native";
import CredentialCard from "../components/CredentialCard"; // Adjust the import path as necessary
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useCredentials } from "../contexts/CredentialsProvider";

// Replace this with the correct path to your image
const backgroundImage = require('../../assets/background.jpg'); // Ensure this path is correct

interface CredentialsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const CredentialsScreen: React.FC<CredentialsScreenProps> = ({ navigation }) => {
  const { credentials, retrieveCredentials } = useCredentials();

  useEffect(() => {
    retrieveCredentials();
  }, [retrieveCredentials]);

  console.log("Credentials: ", credentials);

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        {credentials && credentials.length > 0 ? (
          <FlatList
            data={credentials}
            keyExtractor={(item) => item.hash}
            renderItem={({ item }) => (
              <CredentialCard credentialCard={item} navigation={navigation} />
            )}
          />
        ) : (
          <View style={styles.noCredentialsContainer}>
            <Text style={styles.noCredentialsText}>No credentials available</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  noCredentialsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCredentialsText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'gray',
  },
});

export default CredentialsScreen;
