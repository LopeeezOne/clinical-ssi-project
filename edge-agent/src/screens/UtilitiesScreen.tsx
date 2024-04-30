import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { agent } from "../components/Agent";
import {
  IIdentifier,
  IMessage,
  IService,
  IVerifyResult,
  VerifiableCredential,
} from "@veramo/core";
import {
  CoordinateMediation,
  UpdateAction,
  createV3DeliveryRequestMessage,
  createV3MediateRequestMessage,
  createV3RecipientUpdateMessage,
} from "@veramo/did-comm";
import { mediator } from "../constants/constants";
import { useAuth } from "../contexts/AuthProvider";

interface UtilitiesScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const UtilitiesScreen: React.FC<UtilitiesScreenProps> = ({ navigation }) => {
  const [message, setMessage] = useState<IMessage | undefined>();
  const [input, setInput] = useState<string>("");
  const { user } = useAuth();
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
    const service: IService = {
      id: "msg1",
      type: "DIDCommMessaging",
      serviceEndpoint: mediator.did,
    };

    const _id = await agent.didManagerCreate({
      provider: "did:peer",
      alias: user.username,
      options: { num_algo: 2, service: service },
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
    };

    getIdentifiers();
  }, []);

  const retrieveDID = async (alias: string) => {
    return await agent.didManagerFind({
      alias: alias,
    });
  };

  const requestMediation = async () => {
    // Retrieve DIDs from Agent and Mediator
    const recipient = (await retrieveDID("Alice"))[0];

    // Send the mediation message
    const request = createV3MediateRequestMessage(recipient.did, mediator.did);
    const packedRequest = await agent.packDIDCommMessage({
      packing: "anoncrypt",
      message: request,
    });
    const mediationResponse = await agent.sendDIDCommMessage({
      packedMessage: packedRequest,
      recipientDidUrl: mediator.did,
      messageId: request.id,
    });
    if (
      mediationResponse.returnMessage?.type !==
      CoordinateMediation.MEDIATE_GRANT
    ) {
      throw new Error("mediation not granted");
    }

    // Update the status in the mediator
    const update = createV3RecipientUpdateMessage(recipient.did, mediator.did, [
      {
        recipient_did: recipient.did,
        action: UpdateAction.ADD,
      },
    ]);
    const packedUpdate = await agent.packDIDCommMessage({
      packing: "anoncrypt",
      message: update,
    });
    const updateResponse = await agent.sendDIDCommMessage({
      packedMessage: packedUpdate,
      recipientDidUrl: mediator.did,
      messageId: update.id,
    });
    if (
      updateResponse.returnMessage?.type !==
        CoordinateMediation.RECIPIENT_UPDATE_RESPONSE ||
      (updateResponse.returnMessage?.data as any)?.updates[0].result !==
        "success"
    ) {
      throw new Error("mediation update failed");
    }

    console.log("Mediation produced correctly!");
  };

  const sendCredential = async () => {
    const receiver = (await retrieveDID("Alice"))[0];
    const sender = (await retrieveDID("Bob"))[0];

    const verifiableCredential = await agent.createVerifiableCredential({
      credential: {
        issuer: { id: sender.did },
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: "medical information",
          data: input,
        },
      },
      save: false,
      proofFormat: "jwt",
    });

    const msg = {
      type: "https://didcomm.org/basicmessage/2.0/message",
      from: sender.did,
      to: receiver.did, // Bob doesn't care that alice is using a mediator
      id: "dsfgfdsgsfdgs",
      body: verifiableCredential,
    };
    const packed = await agent.packDIDCommMessage({
      packing: "anoncrypt",
      message: msg,
    });
    const result = await agent.sendDIDCommMessage({
      packedMessage: packed,
      recipientDidUrl: receiver.did,
      messageId: msg.id,
    });

    console.log(result);
  };

  const pickupMessage = async () => {
    const recipient = (await retrieveDID("Alice"))[0];

    // Agent checks for new messages
    const deliveryRequest = createV3DeliveryRequestMessage(
      recipient.did,
      mediator.did
    );
    const packedRequest = await agent.packDIDCommMessage({
      packing: "anoncrypt",
      message: deliveryRequest,
    });
    const deliveryResponse = await agent.sendDIDCommMessage({
      packedMessage: packedRequest,
      recipientDidUrl: mediator.did,
      messageId: deliveryRequest.id,
    });

    for (const attachment of deliveryResponse?.returnMessage?.attachments ??
      []) {
      const msg = await agent.handleMessage({
        raw: JSON.stringify(attachment.data.json),
      });
      console.log(msg.data);
      setMessage(msg);
    }
  };

  const sendMessage = async () => {
    const receiver = (await retrieveDID("Alice"))[0];
    const sender = (await retrieveDID("Bob"))[0];

    const msg = {
      type: "https://didcomm.org/basicmessage/2.0/message",
      from: sender.did,
      to: receiver.did, // Bob doesn't care that alice is using a mediator
      id: "test-message",
      body: "Hi Alice, this is Bob!",
    };
    const packed = await agent.packDIDCommMessage({
      packing: "anoncrypt",
      message: msg,
    });
    const result = await agent.sendDIDCommMessage({
      packedMessage: packed,
      recipientDidUrl: receiver.did,
      messageId: msg.id,
    });

    console.log(result);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ padding: 20, paddingTop: 50 }}>
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
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Request Mediation
          </Text>
          <Button onPress={() => requestMediation()} title={"Start!"} />
        </View>
        <View style={styles.container}></View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>Send Message</Text>
          <Button onPress={() => sendMessage()} title={"Let's go!"} />
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Pickup Message
          </Text>
          <Button onPress={() => pickupMessage()} title={"Receive message"} />
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Send Credential
          </Text>
          <Button onPress={() => sendCredential()} title={"Send Credential"} />
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={(text) => setInput(text)}
            placeholder="Enter text here..."
          />
          <Text style={{ fontSize: 10 }}>
            {JSON.stringify(message, null, 2)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatlist: {
    padding: 20,
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
});

export default UtilitiesScreen;