import React, { useEffect, useState } from "react";
import { Button, Text, View, ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthProvider";
import { IIdentifier, IService, IVerifyResult, VerifiableCredential } from "@veramo/core";
import { agent } from "../components/Agent";
import { mediator } from "../constants/constants";
import { useConnections } from "../contexts/ConnectionsProvider";

// Definir las props esperadas por HomeScreen
interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

type Styles = {
  container: any;
  welcomeText: any;
  section: any;
  sectionHeader: any;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const { user } = useAuth();
  const { retrieveConnections } = useConnections(); 
  const [identifiers, setIdentifiers] = useState<IIdentifier[]>([]);
  const [credential, setCredential] = useState<
    VerifiableCredential | undefined
  >();
  const [verificationResult, setVerificationResult] = useState<
    IVerifyResult | undefined
  >();

  const verifyCredential = async () => {
    if (credential) {
      const result = await agent.verifyCredential({ credential });
      setVerificationResult(result);
    }
  };

  const createIdentifier = async () => {
    const service : IService = {
      id: "msg1",
      type: "DIDCommMessaging",
      serviceEndpoint: mediator.did,
    };

    const _id = await agent.didManagerCreate({
      provider: "did:peer",
      alias: user.username,
      options: {num_algo: 2, service: service}
    });

    setIdentifiers((s) => s.concat([_id]));
  };

  const handleRemoveId = async (did: string) => {
    setIdentifiers(identifiers.filter((item) => item.did !== did));
    agent.didManagerDelete({
      did: did,
    });
  };

  const createCredential = async () => {
    if (identifiers[0].did) {
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: identifiers[0].did },
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: "How are you",
            you: "Rock",
          },
        },
        save: false,
        proofFormat: "jwt",
      });

      setCredential(verifiableCredential);
    }
  };

  // Check for existing identifers on load and set them to state
  useEffect(() => {
    const getIdentifiers = async () => {
      const _ids = await agent.didManagerFind();
      setIdentifiers(_ids);

      console.log("_ids:", _ids);
      const connections = await retrieveConnections();
      console.log("Imhere")
      console.log(connections);
    };

    getIdentifiers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome and Summary Section */}
      <View style={styles.section}>
        <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>
        <Text>
          Your next appointment is on [Date] at [Time] with [Provider Name].
        </Text>
      </View>

      {/* Updates and Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Recent Updates</Text>
        <Text>- You have a new message from [Sender Name].</Text>
        <Text>
          - Your appointment with [Provider Name] has been confirmed for [Date].
        </Text>
      </View>

      {/* Educational Content and Health Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Learn with Us</Text>
        <Text>- How to manage stress effectively.</Text>
        <Text>- Understanding Self-Sovereign Identity and its benefits.</Text>
      </View>

      <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Identifiers</Text>
          <Button
            onPress={() => createIdentifier()}
            title={"Create Identifier"}
          />
          <View style={{ marginBottom: 50, marginTop: 20 }}>
            {identifiers && identifiers.length > 0 ? (
              identifiers.map((id: IIdentifier) => (
                <View key={id.did}>
                  <Button
                    title={id.did}
                    onPress={() => handleRemoveId(id.did)}
                  />
                </View>
              ))
            ) : (
              <Text>No identifiers created yet</Text>
            )}
          </View>
          <View style={{ padding: 20 }}>
            <Button
              title={"Create Credential"}
              disabled={!identifiers || identifiers.length === 0}
              onPress={() => createCredential()}
            />
            <Text style={{ fontSize: 10 }}>
              {JSON.stringify(credential, null, 2)}
            </Text>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <Button
            title={"Verify Credential"}
            onPress={() => verifyCredential()}
            disabled={!credential}
          />
          <Text style={{ fontSize: 10 }}>
            {JSON.stringify(verificationResult, null, 2)}
          </Text>
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
    fontSize: 20,
    fontWeight: 'bold' as 'bold',
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600' as '600',
    marginBottom: 10,
  },
});

export default HomeScreen;
  