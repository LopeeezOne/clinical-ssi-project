import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button, TextInput, Pressable } from "react-native";
import { Connection } from "../model/Connection";
import { agent } from "./Agent";
import { useAuth } from "../contexts/AuthProvider";
import { useConnections } from "../contexts/ConnectionsProvider";


interface ConnectionCardProps {
  connection: Connection;
  navigation: NavigationProp<ParamListBase>;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");

  const { user } = useAuth();
  const { removeConnection } = useConnections();

  const createCredential = async () => {
    const sender = connection.did_created;
    const receiver = connection.did_received;
    const issuer = await agent.didManagerFind({ alias: user.username });
    console.log(issuer);
    const verifiableCredential = await agent.createVerifiableCredential({ // did:key / did:web / did:ethr / did:indy
      credential: {
        issuer: { id: issuer[0].did },
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: "Medical prescription",
          data: input,
          alias: user.username,
        },
      },
      // I need to decide if I want to save the credential for the creator. Probably yes, because the creator should be able to revoke it.
      save: false,
      proofFormat: "jwt",
    });

    const msg = {
      type: "https://didcomm.org/issue-credential",
      from: sender,
      to: receiver,
      id: "1",
      body: verifiableCredential,
    };
    const packed = await agent.packDIDCommMessage({
      packing: "anoncrypt",
      message: msg,
    });
    const result = await agent.sendDIDCommMessage({
      packedMessage: packed,
      recipientDidUrl: receiver,
      messageId: msg.id,
    });

    alert("Verifiable Credential Sent!");
    setInput("");
  };

  return (
    <TouchableOpacity
      onPress={() => setIsExpanded(!isExpanded)}
      style={styles.card}
    >
      <Text style={styles.title}>{connection.connection_alias}</Text>
      <Text>Creation Date: {JSON.stringify(connection.createdAt)}</Text>
      {isExpanded && (
        <View>
          <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="Enter text here..."
          />
          <Pressable
            style={styles.buttonCreate}
            onPress={() => createCredential()}
          >
            <Text style={styles.buttonText}>Create Credential</Text>
          </Pressable>
          <Pressable
            style={styles.buttonRemove}
            onPress={() => removeConnection(connection)}
          >
            <Text style={styles.buttonText}>Remove Connection</Text>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "gray",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  buttonCreate: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
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

export default ConnectionCard;
