import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Connection } from '../model/Connections';
import { DataSource } from 'typeorm';
import { migrations } from '../model/CreateConnectionsTable';

interface ConnectionContextType {
  connections: Connection[];
  addConnection: (newConnectionData: Partial<Connection>) => Promise<void>;
  retrieveConnections: () => Promise<Connection[]>;
  // You can add more operations here as needed, such as deleteConnection, updateConnection, etc.
}

// Initialize dataSource outside of the component to avoid re-initializing on every render
let dataSourcePromise: Promise<DataSource>;
try {
  dataSourcePromise = new DataSource({
    type: 'expo',
    driver: require('expo-sqlite'),
    database: 'veramo.sqlite',
    migrations: migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: [Connection],
  }).initialize();
} catch (error) {
  console.error("Failed to initialize data source:", error);
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    // Fetch existing connections from the database when the provider mounts
    const fetchConnections = async () => {
      try {
        const dataSource = await dataSourcePromise;
        const ConnectionRepository = dataSource.getRepository(Connection);
        const existingConnections = await ConnectionRepository.find();
        console.log("Connections:", existingConnections);
        setConnections(existingConnections);
      } catch (error) {
        console.error("Failed to fetch connections:", error);
      }
    };

    fetchConnections();
  }, []);

  const addConnection = async (newConnectionData: Partial<Connection>) => {
    try {
      const dataSource = await dataSourcePromise;
      const ConnectionRepository = dataSource.getRepository(Connection);
      const newConnection = ConnectionRepository.create(newConnectionData);
      await ConnectionRepository.save(newConnection);
      setConnections(prevConnections => [...prevConnections, newConnection]);
    } catch (error) {
      console.error("Failed to add connection:", error);
    }
  };

  const retrieveConnections = async () => {
    try {
      const dataSource = await dataSourcePromise;
      console.log("Im here")
      const ConnectionRepository = dataSource.getRepository(Connection);
      const existingConnections = await ConnectionRepository.find();
      console.log("Retrieved Connections:", existingConnections);
      setConnections(existingConnections);
      return existingConnections;
    } catch (error) {
      console.error("Failed to retrieve connections:", error);
      return [];
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ connections, addConnection, retrieveConnections }), [connections]);

  return (
    <ConnectionContext.Provider value={value}>
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