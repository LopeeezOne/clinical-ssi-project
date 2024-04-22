import React, { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useConnections } from "../contexts/ConnectionsProvider";
import { mediator } from "../constants/constants";
import {
  createV3DeliveryRequestMessage
} from "@veramo/did-comm";
import { agent } from "./Agent";
import { Connection } from "../model/Connection";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { VerifiableCredential } from "@veramo/core";

interface ForegroundTaskScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const ForegroundTaskComponent: React.FC<ForegroundTaskScreenProps> = ({
  navigation,
}) => {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const { connections, draftConnection, addDraftConnection, addConnection } =
    useConnections();
  let counter = 0;

  const checkNewMessages = async (connection: Connection) => {
    // Agent checks for new messages
    const deliveryRequest = createV3DeliveryRequestMessage(
      connection.did_created,
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

      // Case of establishing a new connection
      if (msg.id === "invitation-request") {
        if (connection.did_received === "") {
          connection.did_received = JSON.stringify(msg.from);
          addConnection(connection);
          addDraftConnection(undefined); 

          const message = {
            type: "https://didcomm.org/messagepickup/3.0/messages-received",
            from: connection.did_created,
            to: mediator.did,
            id: "messages-received!",
            body: {
              message_id_list: [msg.id],
            },
            return_route: "all",
          };

          const packedRequest = await agent.packDIDCommMessage({
            packing: "anoncrypt",
            message: message,
          });

          const messagesReceived = await agent.sendDIDCommMessage({
            packedMessage: packedRequest,
            recipientDidUrl: mediator.did,
            messageId: message.id,
          });

          // console.log("Message messages-received sent:", messagesReceived);

          alert("Connection established: " + msg.from);
          navigation.navigate("Connections");
        }
      }
      // Case of receiving a verifiable credential
      if (msg.type === "https://didcomm.org/issue-credential") {
        const verifiableCredential : VerifiableCredential = msg.data as VerifiableCredential;
        try {
          // console.log("Verifiable Credential: ", verifiableCredential);
          agent.dataStoreSaveVerifiableCredential({verifiableCredential});//JSON.parse(credential));
        } catch (error) {
          console.log(error);
        }
        
        const message = {
          type: "https://didcomm.org/messagepickup/3.0/messages-received",
          from: connection.did_created,
          to: mediator.did,
          id: "messages-received!",
          body: {
            message_id_list: [msg.id],
          },
          return_route: "all",
        };

        const packedRequest = await agent.packDIDCommMessage({
          packing: "anoncrypt",
          message: message,
        });

        const messagesReceived = await agent.sendDIDCommMessage({
          packedMessage: packedRequest,
          recipientDidUrl: mediator.did,
          messageId: message.id,
        });

        // console.log("Message messages-received sent:", messagesReceived);
      }
    }
  };

  useEffect(() => {
    const myPeriodicTask = async (): Promise<void> => {
      // Case for establish a new connection, a new DID has been created
      if (draftConnection !== undefined) {
        console.log("Possible connection created!");
        console.log("Counter: ", counter);
        checkNewMessages(draftConnection);
        counter++;
        // If the connection is not established after to 4 executions, the connection is not created
        // I should also remove the DID created since it is no longer usable
        if (counter == 4) {
          console.log("ERROR: Connection not created!");
          addDraftConnection(undefined);
          alert("ERROR: Time for establish a connection exceded!");
          navigation.navigate("Connections");
          return;
        }
      // Case when there is no active connection  
      } else if (connections.length === 0) {
        console.log("There is still no active connection!");
        return;
      // Case when there is, at least, an active connection
      } else {
        console.log("Running periodic task");
        connections.forEach(async (connection) => {
          // Agent checks for new messages
          checkNewMessages(connection);
        });
      }
    };

    let intervalId: ReturnType<typeof setInterval>;

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("App has come to the foreground!");
          intervalId = setInterval(myPeriodicTask, 10000); // adjust the interval as needed
        } else if (nextAppState.match(/inactive|background/)) {
          console.log("App has gone to the background!");
          clearInterval(intervalId);
        }
        setAppState(nextAppState);
      }
    );

    // Start the interval if the app is initially in the foreground
    if (appState === "active") {
      intervalId = setInterval(myPeriodicTask, 10000); // adjust the interval as needed
    }

    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
      appStateSubscription.remove(); // Use the remove method from the subscription object
    };
  }, [appState, connections, draftConnection]);

  return (
    <></>
  );
};

export default ForegroundTaskComponent;
