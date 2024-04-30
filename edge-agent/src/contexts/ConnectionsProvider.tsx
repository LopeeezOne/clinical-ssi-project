// contexts/ConnectionProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Connection } from '../model/Connection';

interface ConnectionContextType {
  connections: Connection[];
  addConnection: (newConnection: Connection) => Promise<void>;
  removeConnection: (connectionToRemove: Connection) => Promise<void>;
  retrieveConnections: () => Promise<Connection[]>;
  removeConnections: () => Promise<void>;
  draftConnection: Connection | undefined;
  addDraftConnection: (Connection: Connection) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnections = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const ConnectionProvider: React.FC<Props> = ({ children }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draftConnection, setDraftConnection] = useState<Connection|undefined>(undefined);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const connectionsString = await AsyncStorage.getItem('connections');
        const connections = connectionsString ? JSON.parse(connectionsString) : [];
        setConnections(connections);
      } catch (error) {
        console.error('Error fetching connections from AsyncStorage:', error);
      }
    };

    fetchConnections();
  }, []);

  const addDraftConnection = (Connection: Connection | undefined) => {
    setDraftConnection(Connection);
  }

  const addConnection = async (newConnection: Connection) => {
    try {
      const updatedConnections = [...connections, newConnection];
      await AsyncStorage.setItem('connections', JSON.stringify(updatedConnections));
      setConnections(updatedConnections);
    } catch (error) {
      console.error('Error saving connection to AsyncStorage:', error);
    }
  };

  const removeConnection = async (connectionToRemove: Connection) => {
    try {
        const updatedConnections = connections.filter(connection => connection.connection_alias !== connectionToRemove.connection_alias);
        await AsyncStorage.setItem('connections', JSON.stringify(updatedConnections));
        setConnections(updatedConnections);
        alert('Connection removed successfully');
    } catch (error) {
        console.error('Error removing connection from AsyncStorage:', error);
    }
};

  const retrieveConnections = async (): Promise<Connection[]> => {
    try {
      const connectionsString = await AsyncStorage.getItem('connections');
      return connectionsString ? JSON.parse(connectionsString) : [];
    } catch (error) {
      console.error('Error retrieving connections from AsyncStorage:', error);
      return [];
    }
  };

  const removeConnections = async () => {
    try {
      AsyncStorage.removeItem('connections');
    } catch (error) {
      console.error('Error retrieving connections from AsyncStorage:', error);
    }
  }

  return (
    <ConnectionContext.Provider value={{ connections, addConnection, removeConnection, retrieveConnections, removeConnections, draftConnection, addDraftConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};