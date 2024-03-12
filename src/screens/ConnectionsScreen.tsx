import React, { useEffect, useState } from "react";
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
import { NavigationProp, ParamListBase, useIsFocused } from "@react-navigation/native";
import { agent } from "../components/Agent";
import { IService } from "@veramo/core";
import { useAuth } from "../contexts/AuthProvider";
import QRCode from "react-native-qrcode-svg";
import {
  CoordinateMediation,
  UpdateAction,
  createV3MediateRequestMessage,
  createV3RecipientUpdateMessage,
} from "@veramo/did-comm";
import { mediator } from "../constants/constants";

interface ConnectionsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const ConnectionsScreen: React.FC<ConnectionsScreenProps> = ({
  navigation,
}) => {
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [alias_1, setAlias_1] = useState<string>("");
  const [alias_2, setAlias_2] = useState<string>("");

  const { user } = useAuth();

  // Function to generate QR code content
  const generateQRContent = async (alias: string) => {
    if (alias === "") {
      alert("Alias not indicated!");
      return; // Early return to stop the function execution
    }
    const service: IService = {
      id: "msg1",
      type: "DIDCommMessaging",
      serviceEndpoint: mediator.did,
    };

    const recipient = await agent.didManagerCreate({
      provider: "did:peer",
      alias: alias,
      options: { num_algo: 2, service: service },
    });

    const content = {
      alias: alias,
      did: recipient.did,
    };

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

    // Update state with the new QR code content
    setQrContent(JSON.stringify(content));
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleNewConnection = () => {
    navigation.navigate('Camera');
  };

  // useEffect(() => {
  //   if (isFocused) {
  //     // Reset your state here
  //     setAlias_1("");
  //     setAlias_2("");
  //   }
  // }, [isFocused]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ marginBottom: 7, fontSize: 25, fontWeight: "bold" }}>
            Generate connection
          </Text>
          <TextInput
            style={styles.input}
            value={alias_1}
            onChangeText={(text) => setAlias_1(text)}
            placeholder="Enter en alias for the connection..."
          />
          <Button
            title="Start New Connection"
            onPress={() => generateQRContent(alias_1)}
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
          <View>
            <Text
              style={{
                marginBottom: 10,
                marginTop: 40,
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              Scan connection
            </Text>
            <TextInput
              style={styles.input}
              value={alias_2}
              onChangeText={(text) => setAlias_2(text)}
              placeholder="Enter en alias for the connection..."
            />
            <Button
              title="Scan New Connection"
              onPress={() => handleNewConnection()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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

export default ConnectionsScreen;

// const importDID = async () => {
//   const mediator = await agent.didManagerImport({
//     did: 'did:peer:2.Ez6LSckzwpNvzQ1ex4oZG5E6FQgqbm4nryTCMk1a1wtCHpKMR.Vz6Mkkg6fGVG5XnNstDQQdtu4515gZMwyLdZpVFSXM94fFoC2.SeyJpZCI6Im1zZzEiLCJ0IjoiZG0iLCJzIjoiaHR0cDovLzE5Mi4xNjguNTEuMTYyOjMwMDAvbWVzc2FnaW5nIn0',
//     keys: [
//       {
//         type: 'Ed25519',
//         kid: 'didcomm-mediatorKey-1',
//         publicKeyHex: '1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
//         privateKeyHex:
//           'b57103882f7c66512dc96777cbafbeb2d48eca1e7a867f5a17a84e9a6740f7dc1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
//         kms: 'local',
//       },
//     ],
//     services: [
//       {
//         id: 'msg1',
//         type: 'DIDCommMessaging',
//         serviceEndpoint: 'http://192.168.51.162:3000/messaging',
//       },
//     ],
//     provider: 'did:peer',
//     alias: 'Mediator',
//   })

//   const recipient = await agent.didManagerImport({
//     did: 'did:peer:2.Ez6LSs2cLor5NRQWBzgjYpgW8UBUHSt4x8TCYygEASqDVTEje.Vz6Mko5r7r97jYB27LRn3BokcQ8AX6DiC2ExpKFMRzhKa8EnE.SeyJpZCI6Im1zZzEiLCJ0IjoiZG0iLCJzIjoiaHR0cDovLzE5Mi4xNjguNTEuMTYyOjMwMDAvbWVzc2FnaW5nIn0',
//     keys: [
//       {
//         type: 'Ed25519',
//         kid: 'didcomm-recipientKey-1',
//         publicKeyHex: '1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
//         privateKeyHex:
//           'b57103882f7c66512dc96777cbafbeb2d48eca1e7a867f5a17a84e9a6740f7dc1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
//         kms: 'local',
//       },
//     ],
//     services: [
//       {
//         id: 'msg1',
//         type: 'DIDCommMessaging',
//         serviceEndpoint: 'http://192.168.51.162:3000/messaging',
//       },
//     ],
//     provider: 'did:peer',
//     alias: 'Agent',
//   })

//   setIdentifiers((s) => s.concat([mediator]));
//   setIdentifiers((s) => s.concat([recipient]));

//   const didDoc = (await agent.resolveDid({ didUrl: recipient.did })).didDocument;
//   console.log(`New did recipient created:`, didDoc);
// }
