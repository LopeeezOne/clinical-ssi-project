import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera } from "expo-camera";
import { CameraView } from "expo-camera";
import { useConnections } from "../contexts/ConnectionsProvider";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { agent } from "../components/Agent";

interface CameraScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  // const [permissions, requestPermission] = useCameraPermissions();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { draftConnection, addConnection, addDraftConnection } = useConnections();

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

    if (draftConnection !== undefined) {
      draftConnection.did_received = scannedData.did;
      console.log("Draft connection exists: ", JSON.stringify(draftConnection));
      await addConnection(draftConnection);
      alert("New connection established! " + data);
      
      const msg = {
        type: "https://didcomm.org/basicmessage/2.0/message",
        from: draftConnection.did_created,
        to: draftConnection.did_received, // Bob doesn't care that alice is using a mediator
        id: "invitation-request",
        body: "Invitation sent!",
      };
      const packed = await agent.packDIDCommMessage({
        packing: "anoncrypt",
        message: msg,
      });
      const result = await agent.sendDIDCommMessage({
        packedMessage: packed,
        recipientDidUrl: draftConnection.did_received,
        messageId: msg.id,
      });
  
      console.log(result);

      addDraftConnection(undefined);
      navigation.navigate("Connections");
    }
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
