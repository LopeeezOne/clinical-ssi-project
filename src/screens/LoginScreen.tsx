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

// Definición de los tipos para los estados
interface LoginState {
  username: string;
  password: string;
  role: string;
}

// Definir las props esperadas por HomeScreen
interface LoginScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState<LoginState>({
    username: "",
    password: "",
    role: "",
  });

  const handleLogin = () => {
    // Aquí puedes agregar la lógica para verificar las credenciales
    // Por ejemplo, haciendo una petición a tu servidor de backend
    if (credentials.username === "" && credentials.password === "" && credentials.role === ""){
      Alert.alert(
        "ERROR",
        `The fields can not be empty`
      );
    } else {
      Alert.alert(
        "Login Attempt",
        `Successful login!`
      );
      login(credentials.username, "success", credentials.password, credentials.role);
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
      <Pressable style={styles.button} onPress={() => handleLogin()}>
        <Text style={styles.text}>Login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
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
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

export default LoginScreen;

