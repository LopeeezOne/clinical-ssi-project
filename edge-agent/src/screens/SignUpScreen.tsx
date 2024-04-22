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
  password: string;
  repeatPassword: string;
  role: string;
}

// Definir las props esperadas por HomeScreen
interface SignUpScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { login } = useAuth();

  const [credentials, setCredentials] = useState<SignUpState>({
    username: "",
    password: "",
    repeatPassword: "",
    role: "",
  });

  // const handleSignUp to handle the SignUp logic.
  // The function will check if the fields are empty and if not, it will create a did, send a message, alert the user and navigate to the Tabs screen.
  const handleSignUp = async () => {
    if (
      credentials.username === "" ||
      credentials.password === "" ||
      credentials.repeatPassword === "" ||
      credentials.role === ""
    ) {
      Alert.alert("ERROR", `The fields can not be empty`);
    } else if (credentials.password !== credentials.repeatPassword) {
      Alert.alert("ERROR", `Passwords do not match`);
    } else {
      Alert.alert("SignUp Attempt", `Successful SignUp!`);
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

      login(
        credentials.username,
        "success",
        credentials.password,
        credentials.role
      );
      navigation.navigate("Tabs");
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
        placeholder="Password"
        secureTextEntry
        value={credentials.password}
        onChangeText={(text) =>
          setCredentials({ ...credentials, password: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat password"
        secureTextEntry
        value={credentials.repeatPassword}
        onChangeText={(text) =>
          setCredentials({ ...credentials, repeatPassword: text })
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
