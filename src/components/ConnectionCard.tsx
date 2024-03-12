import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ConnectionCardProps {
  connection: ConnectionCard;
  navigation: NavigationProp<ParamListBase>;
}

interface ConnectionCard {
  id: string;
  destination_alias: string;
  destination_did: string;
}

const CredentialCard: React.FC<ConnectionCardProps> = ({ connection, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.card}>
      <Text style={styles.title}>{connection.destination_alias}</Text>
      <Text>Destination Alias: {connection.destination_alias}</Text>
      <Text>Destination DID: {connection.destination_did}</Text>
      {/* {isExpanded && <Text>Description: {credential.description}</Text>} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  // Additional styles as needed
});

export default ConnectionCard;