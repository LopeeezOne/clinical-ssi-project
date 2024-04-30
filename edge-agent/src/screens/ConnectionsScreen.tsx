import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ConnectionCard from "../components/ConnectionCard";
import { useConnections } from "../contexts/ConnectionsProvider";

interface ConnectionsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const ConnectionsScreen: React.FC<ConnectionsScreenProps> = ({
  navigation,
}) => {
  const { connections, retrieveConnections } = useConnections();
  
  const handleNewConnection = () => {
    navigation.navigate("NewConnection");
  };

  useEffect(() => {
    retrieveConnections(); // Fetch connections when the component mounts
  }, [retrieveConnections]);

  return (
    <View style={styles.outerContainer}>
      {/* Outer container for positioning the floating button */}
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <FlatList
            data={connections}
            keyExtractor={(item) => item.connection_alias}
            renderItem={({ item }) => (
              <ConnectionCard connection={item} navigation={navigation} />
            )}
          />
        </View>
      </SafeAreaView>
      <TouchableOpacity
        onPress={() => handleNewConnection()}
        style={styles.floatingButton}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1, // Ensure this container fills the screen
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  floatingButton: {
    backgroundColor: "tomato", // Use your desired color
    width: 56, // Adjust size as necessary
    height: 56, // Adjust size as necessary
    borderRadius: 28, // Half of the width/height to make it circular
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20, // Distance from the bottom
    right: 20, // Distance from the right
    elevation: 4, // Shadow for Android (optional)
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
  },
});

export default ConnectionsScreen;
