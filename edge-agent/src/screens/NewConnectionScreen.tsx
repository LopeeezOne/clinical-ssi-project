import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { agent } from "../components/Agent";
import { IService } from "@veramo/core";
import QRCode from "react-native-qrcode-svg";
import {
  CoordinateMediation,
  UpdateAction,
  createV3MediateRequestMessage,
  createV3RecipientUpdateMessage,
} from "@veramo/did-comm";
import { mediator } from "../constants/constants";
import { useConnections } from "../contexts/ConnectionsProvider";

interface ConnectionsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const NewConnectionScreen: React.FC<ConnectionsScreenProps> = ({
  navigation,
}) => {
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [alias, setAlias] = useState<string>("");
  const [didCreated, setDidCreated] = useState<boolean>(false);
  const [did, setDid] = useState<string>("");

  const { addDraftConnection } = useConnections();

  const handleCreateDID = async () => {
    // Implement DID creation logic here
    // Set 'didCreated' state to true if DID is created successfully
    const service: IService = {
      id: "msg1",
      type: "DIDCommMessaging",
      serviceEndpoint: mediator.did,
    };

    if (alias === "") {
      alert("Alias not indicated!");
      return;
    }

    const recipient = await agent.didManagerCreate({
      provider: "did:peer",
      alias: alias,
      options: { num_algo: 2, service: service },
    });

    // const didDocument = (await agent.resolveDid({didUrl: recipient.did})).didDocument;
    // console.log("DID Document:", didDocument);

    // Request Mediation for this did created
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

    alert("DID created: " + recipient.did);
    setDid(recipient.did);
    setDidCreated(true);
    addDraftConnection({
      connection_alias: alias,
      did_created: recipient.did,
      did_received: "",
      createdAt: new Date(),
    });
  };
  // const { user } = useAuth();

  // Function to generate QR code content
  const generateQRContent = async () => {
    const content = {
      did: did,
    };
    
    // Update state with the new QR code content
    setQrContent(JSON.stringify(content));
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleNewConnection = () => {
    navigation.navigate("Camera");
  };

  // useEffect(() => {
  //   if (isFocused) {
  //     // Reset your state here
  //     setAlias_1("");
  //     setAlias_2("");
  //   }
  // }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {!didCreated ? (
            <>
              <Text
                style={{ marginBottom: 7, fontSize: 25, fontWeight: "bold" }}
              >
                Create DID
              </Text>
              <TextInput
                style={styles.input}
                value={alias}
                onChangeText={setAlias}
                placeholder="Enter an alias for the connection..."
              />
              <Button title="Create DID" onPress={handleCreateDID} />
            </>
          ) : (
            <>
              <Button
                title="Start New Connection"
                onPress={() => generateQRContent()}
              />
              {qrContent && (
                <TouchableOpacity onPress={toggleModal}>
                  <View style={styles.qrCodeContainer}>
                    <QRCode value={qrContent} size={300} />
                  </View>
                </TouchableOpacity>
              )}
              <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
              >
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>QR Code Content:</Text>
                  <Text>{qrContent}</Text>
                  <Button title="Close" onPress={toggleModal} />
                </View>
              </Modal>
              <View style={{marginTop: 20}}></View>
              <Button
                title="Scan New Connection"
                onPress={handleNewConnection}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  // return (
  //   <SafeAreaView>
  //     <ScrollView>
  //       <View style={styles.container}>
  //         <Text style={{ marginBottom: 7, fontSize: 25, fontWeight: "bold" }}>
  //           Generate connection
  //         </Text>
  //         <TextInput
  //           style={styles.input}
  //           value={alias_1}
  //           onChangeText={(text) => setAlias_1(text)}
  //           placeholder="Enter en alias for the connection..."
  //         />
  //         <Button
  //           title="Start New Connection"
  //           onPress={() => generateQRContent(alias_1)}
  //         />
  //         {qrContent && (
  //           <TouchableOpacity onPress={toggleModal}>
  //             <View style={styles.qrCodeContainer}>
  //               <QRCode value={qrContent} size={300} />
  //             </View>
  //           </TouchableOpacity>
  //         )}
  //         <Modal
  //           animationType="slide"
  //           transparent={true}
  //           visible={isModalVisible}
  //           onRequestClose={toggleModal}
  //         >
  //           <View style={styles.modalView}>
  //             <Text style={styles.modalText}>QR Code Content:</Text>
  //             <Text>{qrContent}</Text>
  //             <Button title="Close" onPress={toggleModal} />
  //           </View>
  //         </Modal>
  //         <View style={{marginTop: 20}}>
  //           <Button
  //             title="Scan New Connection"
  //             onPress={() => handleNewConnection()}
  //           />
  //         </View>
  //       </View>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    padding: 20,
  },
  qrCodeContainer: {
    marginTop: 20,
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default NewConnectionScreen;
