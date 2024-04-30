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
import { useCredentials } from "../contexts/CredentialsProvider";
import { mediator } from "../constants/constants";
import { useAuth } from "../contexts/AuthProvider";

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
  const { removeCredential } = useCredentials();
  const { user } = useAuth();

  const verifyCredential = async () => {
    const credential = credentialCard.verifiableCredential;
    const result = await agent.verifyCredential({ credential });

    console.log(result.verified);
    const id = credentialCard.verifiableCredential.credentialSubject?.alias;

    fetch(`http://${mediator.ip}:3000/did/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        const document = JSON.parse(data.Document);
        let id;
        if (typeof credentialCard.verifiableCredential.issuer === "string") {
          id = credentialCard.verifiableCredential.issuer;
        } else {
          id = credentialCard.verifiableCredential.issuer.id;
        }
        console.log(document.did);
        console.log(credentialCard.verifiableCredential.issuer);
        if ((document.did === id) && result.verified) {
          alert("Credential verified!");
        } else {
          alert("Credential not verified!");
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
        Description:{" "}
        {credentialCard.verifiableCredential.credentialSubject?.data ??
          "Default Data"}
      </Text>
      {isExpanded && (
        <View>
          <Text>
            {/* Issued Date: {JSON.parse(credentialCard.verifiableCredential.issuanceDate).toLocaleDateString()} */}
            Issued Date: {credentialCard.verifiableCredential.issuanceDate}
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
            onPress={() => removeCredential(credentialCard.hash)}
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
});

export default CredentialCard;
