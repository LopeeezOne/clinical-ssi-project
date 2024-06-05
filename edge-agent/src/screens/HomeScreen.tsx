import React, { useEffect, useState } from "react";
import { Button, Text, View, ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthProvider";
import { IIdentifier, IService, IVerifyResult, VerifiableCredential } from "@veramo/core";
import { agent } from "../components/Agent";
import { mediator } from "../constants/constants";
import ForegroundTaskComponent from "../components/ForegroundTask";
import { useConnections } from "../contexts/ConnectionsProvider";
import { useCredentials } from "../contexts/CredentialsProvider";

// Definir las props esperadas por HomeScreen
interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

type Styles = {
  container: any;
  welcomeText: any;
  section: any;
  sectionHeader: any;
  textParagraph: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const { user } = useAuth();
  // const {removeCredentials} = useCredentials();
  // removeCredentials();
  // const { removeConnections} = useConnections();
  // removeConnections();
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome and Summary Section */}
      <View style={styles.section}>
        <ForegroundTaskComponent navigation={navigation} />
        <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>
        <Text>
          This is the app to manage your clinical data.
        </Text>
      </View>

      {/* Updates and Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Connections tab</Text>
        <Text style={styles.textParagraph}>- In this tab, you can see your current connections created and establish a new one.</Text>
        <Text style={styles.textParagraph}>
          - Please, you need to indicate a unique alias for new connections. Connections are established using the alias.
        </Text>
      </View>

      {/* Educational Content and Health Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Credentials tab</Text>
        <Text style={styles.textParagraph}>- In credential tab, you can manage your credentials received or sent.</Text>
        <Text style={styles.textParagraph}>- Besides, you can verify the different credentials.</Text>
      </View>
    </ScrollView>
  );
};

// Define styles with TypeScript type
const styles = StyleSheet.create<Styles>({
  container: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: 'bold' as 'bold',
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: '600' as '600',
    marginBottom: 10,
  },
  textParagraph: {
    fontSize: 14,
    // select the arial font
    // this does not work on expo 
    // justify the text in the paragraph
    textAlign: 'justify' as 'justify',
    marginBottom: 10,
  },
});

export default HomeScreen;
  