import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { VerifiableCredential } from "@veramo/core";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";
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

  const removeCredential = async () => {
    await agent.dataStoreDeleteVerifiableCredential({
      hash: credentialCard.hash,
    });
    alert("Credential removed");
  };

  return (
    <TouchableOpacity
      onPress={() => setIsExpanded(!isExpanded)}
      style={styles.card}
    >
      <Text style={styles.title}>
        {credentialCard.verifiableCredential.credentialSubject?.id ??
          "Default ID"}
      </Text>
      <Text>Type: {credentialCard.verifiableCredential.type}</Text>
      <Text>
        Sent by:{" "}
        {credentialCard.verifiableCredential.credentialSubject?.alias ??
          "No alias"}
      </Text>
      <Text>
        Issued Date: {credentialCard.verifiableCredential.issuanceDate}
      </Text>
      {isExpanded && (
        <View>
          <Text>
            Description:{" "}
            {credentialCard.verifiableCredential.credentialSubject?.data ??
              "Default Data"}
          </Text>
          <Text style={styles.text}>
            Issuer:{" "}
            {typeof credentialCard.verifiableCredential.issuer === "string"
              ? credentialCard.verifiableCredential.issuer
              : credentialCard.verifiableCredential.issuer.id}
          </Text>
          <Pressable
            style={styles.buttonVerify}
            onPress={() => verifyCredential()}
          >
            <Text style={styles.buttonText}>Verify Credential</Text>
          </Pressable>
          <Pressable
            style={styles.buttonRemove}
            onPress={() => removeCredential()}
          >
            <Text style={styles.buttonText}>Remove Credential</Text>
          </Pressable>
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
  buttonText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  buttonVerify: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "blue",
    marginTop: 10,
  },
  buttonRemove: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "red",
    marginTop: 10,
  },
  // Additional styles as needed
});

export default CredentialCard;
