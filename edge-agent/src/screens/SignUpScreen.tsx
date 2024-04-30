import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { useAuth } from "../contexts/AuthProvider";
import { mediator } from "../constants/constants";
import { IService } from "@veramo/core";
import { agent } from "../components/Agent";
import {
  CoordinateMediation,
  createV3MediateRequestMessage,
} from "@veramo/did-comm";

// Definición de los tipos para los estados
interface SignUpState {
  username: string;
  pin: string;
  repeatPin: string;
  role: string;
}

interface SignUpScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { login } = useAuth();

  const [credentials, setCredentials] = useState<SignUpState>({
    username: "",
    pin: "",
    repeatPin: "",
    role: "",
  });

  // const handleSignUp to handle the SignUp logic.
  // The function will check if the fields are empty and if not, it will create a did, send a message, alert the user and navigate to the Tabs screen.
  const handleSignUp = async () => {
    if (
      credentials.username === "" ||
      credentials.pin === "" ||
      credentials.repeatPin === "" ||
      credentials.role === ""
    ) {
      Alert.alert("ERROR", `The fields can not be empty`);
    } else if (credentials.pin !== credentials.repeatPin) {
      Alert.alert("ERROR", `Passwords do not match`);
    } else {
      const service: IService = {
        id: "msg1",
        type: "DIDCommMessaging",
        serviceEndpoint: mediator.did,
      };

      const recipient = await agent.didManagerCreate({
        provider: "did:peer",
        alias: credentials.username,
        options: { num_algo: 2, service: service },
      });

      const request = createV3MediateRequestMessage(
        recipient.did,
        mediator.did
      );

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

      fetch(`http://${mediator.ip}:3000/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          pin: credentials.pin,
          role: credentials.role,
          did: recipient.did,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            Alert.alert("SignUp Attempt", `Successful SignUp!`);
            login(
              credentials.username,
              "success",
              credentials.pin,
              credentials.role
            );
            navigation.navigate("Tabs");
          } else {
            alert("Invalid PIN");
          }
        })
        .catch((error) => {
          // handle any errors
          console.error(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <RNPickerSelect
        value={credentials.role}
        onValueChange={(role) => setCredentials({ ...credentials, role: role })}
        items={[
          { label: "Patient", value: "patient" },
          { label: "Doctor", value: "doctor" },
          { label: "Laboratory", value: "laboratory" },
        ]}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={credentials.username}
        onChangeText={(text) =>
          setCredentials({ ...credentials, username: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="PIN"
        secureTextEntry
        value={credentials.pin}
        keyboardType="numeric"
        onChangeText={(text) => setCredentials({ ...credentials, pin: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat PIN"
        secureTextEntry
        value={credentials.repeatPin}
        keyboardType="numeric"
        onChangeText={(text) =>
          setCredentials({ ...credentials, repeatPin: text })
        }
      />
      <Pressable style={styles.button} onPress={() => handleSignUp()}>
        <Text style={styles.text}>Sign up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    padding: 25,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "blue",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default SignUpScreen;
