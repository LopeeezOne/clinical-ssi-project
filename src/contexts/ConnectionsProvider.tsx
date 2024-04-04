// contexts/ConnectionProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Connection } from '../model/Connection'; // Adjust the import path as necessary

interface ConnectionContextType {
  connections: Connection[];
  addConnection: (newConnection: Connection) => Promise<void>;
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
    <ConnectionContext.Provider value={{ connections, addConnection, retrieveConnections, removeConnections, draftConnection, addDraftConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

// // ConnectionContext.tsx
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { Connection } from '../model/Connections';
// import { DataSource } from 'typeorm';
// import { migrations } from '../model/CreateConnectionsTable';

// interface ConnectionContextType {
//   connections: Connection[];
//   addConnection: (newConnectionData: Partial<Connection>) => Promise<void>;
//   retrieveConnections: () => Promise<Connection[]>;
//   // You can add more operations here as needed, such as deleteConnection, updateConnection, etc.
// }

// // DB setup:
// let dataSource = new DataSource({
//   type: 'expo',
//   driver: require('expo-sqlite'),
//   database: 'veramo.sqlite',
//   migrations: migrations,
//   migrationsRun: true,
//   logging: ['error', 'info', 'warn'],
//   entities: [Connection],
// }).initialize();

// const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

// export const useConnections = () => {
//   const context = useContext(ConnectionContext);
//   if (!context) {
//     throw new Error('useConnections must be used within a ConnectionProvider');
//   }
//   return context;
// };

// export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [connections, setConnections] = useState<Connection[]>([]);

//   useEffect(() => {
//     // Fetch existing connections from the database when the provider mounts
//     const fetchConnections = async () => {
//       const ConnectionRepository = (await dataSource).getRepository(Connection);
//       const existingConnections = await ConnectionRepository.find();
//       console.log("Connections:", existingConnections);
//       setConnections(existingConnections);
//     };

//     fetchConnections();
//   }, []);

//   const addConnection = async (newConnectionData: Partial<Connection>) => {
//     const ConnectionRepository = (await dataSource).getRepository(Connection);
//     const newConnection = ConnectionRepository.create(newConnectionData);
//     await ConnectionRepository.save(newConnection);
//     setConnections(prevConnections => [...prevConnections, newConnection]);
//   };

//   const retrieveConnections = async () => {
//     const connectionRepository = (await dataSource).getRepository(Connection);
//     const existingConnections = await connectionRepository.find();
//     console.log("Retrieved Connections:", existingConnections);
//     setConnections(existingConnections); // Update state if you want to refresh the connections list in the context
//     return existingConnections; // Return the list of connections
//   };

//   return (
//     <ConnectionContext.Provider value={{ connections, addConnection, retrieveConnections }}>
//       {children}
//     </ConnectionContext.Provider>
//   );
// };