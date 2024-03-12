import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera } from "expo-camera";
import { CameraView } from "expo-camera/next";
import { useConnections } from "../contexts/ConnectionsProvider";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { agent } from "../components/Agent";
import { IService } from "@veramo/core";
import { mediator } from "../constants/constants";
import {
  CoordinateMediation,
  UpdateAction,
  createV3MediateRequestMessage,
  createV3RecipientUpdateMessage,
} from "@veramo/did-comm";

interface CameraScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  // const [permissions, requestPermission] = useCameraPermissions();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { addConnection } = useConnections();

  // // Function to manually request permission
  // const handleRequestPermission = async () => {
  //   console.log("Im here");
  //   const {status} = await Camera.requestCameraPermissionsAsync();
  //   console.log(JSON.stringify(status));
  //   await requestPermission();
  // };
  // // Early return to request permissions if not granted yet
  // if (!permissions || permissions.status !== "granted") {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{ textAlign: "center" }}>
  //         We need your permission to show the camera
  //       </Text>
  //       <Button onPress={handleRequestPermission} title="Grant permission" />
  //     </View>
  //   );
  // }

  useEffect(() => {
    (async () => {
      // This works: const cameraStatus = await Camera.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);

    const scannedData = JSON.parse(data);

    const service: IService = {
      id: "msg1",
      type: "DIDCommMessaging",
      serviceEndpoint: mediator.did,
    };

    const recipient = await agent.didManagerCreate({
      provider: "did:peer",
      alias: scannedData.alias,
      options: { num_algo: 2, service: service },
    });

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

    //console.log(scannedData.alias, recipient.did, scannedData.did, new Date());
    addConnection( {
      alias_received: scannedData.alias,
      did_created: recipient.did,
      did_received: scannedData.did,
      createdAt: new Date(),
    } );

    alert("New connection established! " + data);

    navigation.navigate("Notifications");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan a new connection!</Text>
      <View style={styles.cameraContainer}>
        <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={styles.camera}
      />
      </View>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cameraContainer: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 10,
    marginBottom: 40,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
});

export default CameraScreen;
