import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { VerifiableCredential } from "@veramo/core";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { agent } from "./Agent";

interface CredentialCardProps {
  credentialCard: CredentialCard;
  navigation: NavigationProp<ParamListBase>;
}

interface CredentialCard {
  hash: string;
  verifiableCredential: VerifiableCredential;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credentialCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const verifyCredential = async () => {
    const credential = credentialCard.verifiableCredential;
    const result = await agent.verifyCredential({ credential });
    alert("Credential verification result: " + JSON.stringify(result, null, 2));
  };

  return (
    <TouchableOpacity
      onPress={() => setIsExpanded(!isExpanded)}
      style={styles.card}
    >
      <Text style={styles.title}>
        {credentialCard.verifiableCredential.credentialSubject?.id ?? "Default ID"}
      </Text>
      <Text>Type: {credentialCard.verifiableCredential.type}</Text>
      <Text>Sent by: {credentialCard.verifiableCredential.credentialSubject?.alias ?? "No alias"}</Text>
      <Text>Issued Date: {credentialCard.verifiableCredential.issuanceDate}</Text>
      {isExpanded && (
        <View>
          <Text>
            Description: {credentialCard.verifiableCredential.credentialSubject?.data ??
              "Default Data"}
          </Text>
          <Text style={styles.text}>
            Issuer: {typeof credentialCard.verifiableCredential.issuer === "string"
              ? credentialCard.verifiableCredential.issuer
              : credentialCard.verifiableCredential.issuer.id}
          </Text>
          <Button
            title={"Verify Credential"}
            onPress={() => verifyCredential()}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontWeight: "bold",
  },
  text: {
    marginBottom: 10,
  },

  // Additional styles as needed
});

export default CredentialCard;
