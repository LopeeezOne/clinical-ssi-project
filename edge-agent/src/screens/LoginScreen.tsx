import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { mediator } from "../constants/constants";
import { useAuth } from "../contexts/AuthProvider";

interface LoginScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [alias, setAlias] = useState("");
  const [pin, setPin] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    // send the pin to the server
    fetch(`http://${mediator.ip}:3000/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ alias, pin }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          navigation.navigate("Tabs");
          login(alias, "success", pin, "");
        } else {
          alert("Invalid PIN");
        }
      })
      .catch((error) => {
        // handle any errors
        console.error(error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>ClinicalSync</Text>

        <TextInput
          style={styles.input}
          onChangeText={setAlias}
          value={alias}
          placeholder="Enter your Alias"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPin}
          value={pin}
          placeholder="Enter your PIN"
          keyboardType="numeric"
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.text}>Login</Text>
        </Pressable>

        <Text style={styles.textSignUp}>Don't have an account?</Text>
        <Pressable
          style={styles.buttonSignUp}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.text}>Sign up</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black", // Adjust color as needed
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
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
    width: '100%',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  textSignUp: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
    marginTop: 30,
  },
  buttonSignUp: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "red",
    marginTop: 10,
    width: '100%',
  },
});

export default LoginScreen;
