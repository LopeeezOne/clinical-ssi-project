import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  VirtualizedList,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { agent } from "../components/Agent";
import { IMessage } from "@veramo/core";
import {
  CoordinateMediation,
  UpdateAction,
  createV3DeliveryRequestMessage,
  createV3MediateRequestMessage,
  createV3RecipientUpdateMessage,
} from "@veramo/did-comm";
import { useConnections } from "../contexts/ConnectionsProvider";
import ConnectionCard from "../components/ConnectionCard";
import { mediator } from "../constants/constants";

interface NotificationsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const [message, setMessage] = useState<IMessage | undefined>();
  const [input, setInput] = useState<string>("");

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
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Request Mediation
          </Text>
          <Button onPress={() => requestMediation()} title={"Start!"} />
        </View>
        <View style={styles.container}>
    </View>
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

export default NotificationsScreen;

// const addService = async (service: IService, did: IIdentifier) => {
//   const result = await agent.didManagerAddService({
//     did: did.did,
//     service: service,
//   });
//   console.log(result);
// };

/*
const sendMessage = async () => {
  let receiver = await retrieveDID("Lopez");
  let sender = await retrieveDID("Juan");

  const service = {
    id: "msg1",
    type: "DIDCommMessaging",
    serviceEndpoint: "http://localhost:3002/messaging",
  };


  const service2 = {
    id: "msg1",
    type: "DIDCommMessaging",
    serviceEndpoint: "http://localhost:3002/messaging",
  };

  addService(service, receiver[0]);
  addService(service2, sender[0]);

  receiver = await retrieveDID("Lopez");
  sender = await retrieveDID("Juan");

  console.log(receiver[0])
  */

//If we put this here, it is possible that until the next complete refresh, stopping the app and reloading, the DIDs does not appear
//const sender = agent.didManagerFind();
//const receiver = importDIDreceiver();
