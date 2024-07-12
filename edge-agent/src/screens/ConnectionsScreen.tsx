import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ConnectionCard from "../components/ConnectionCard";
import { useConnections } from "../contexts/ConnectionsProvider";

// Replace this with the correct path to your image
const backgroundImage = require('../../assets/background.jpg'); // Ensure this path is correct

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

  useEffect(() => {
    console.log("Connections:", connections);
  }, [connections]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.outerContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            {connections !== null && connections.length > 0 ? (
              <FlatList
                data={connections}
                keyExtractor={(item) => item.connection_alias}
                renderItem={({ item }) => (
                  <ConnectionCard connection={item} navigation={navigation} />
                )}
              />
            ) : (
              <View style={styles.noConnectionsContainer}>
                <Text style={styles.noConnectionsText}>No connections started</Text>
              </View>
            )}
          </View>
        </SafeAreaView>
        <TouchableOpacity
          onPress={() => handleNewConnection()}
          style={styles.floatingButton}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  outerContainer: {
    flex: 1, // Ensure this container fills the screen
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  noConnectionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noConnectionsText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'gray',
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
