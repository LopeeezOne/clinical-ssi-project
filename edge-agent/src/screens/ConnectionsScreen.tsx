import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
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
