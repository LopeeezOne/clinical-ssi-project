import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CredentialCardProps {
  credential: CredentialCard;
  navigation: NavigationProp<ParamListBase>;
}

interface CredentialCard {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  description?: string;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ credential, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.card}>
      <Text style={styles.title}>{credential.title}</Text>
      <Text>Issuer: {credential.issuer}</Text>
      <Text>Issued Date: {credential.issuedDate}</Text>
      {isExpanded && <Text>Description: {credential.description}</Text>}
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

export default CredentialCard;