import React from "react";
import { Button, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthProvider";

// Definir las props esperadas por HomeScreen
interface ProfileScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 100,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Hello {user.username}, {user.role}</Text>
      <Button onPress={() => handleLogout()} title={"Logout"} />
    </View>
  );
};

export default ProfileScreen;
