// contexts/CredentialsProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import CredentialCard from "../components/CredentialCard";
import { agent } from "../components/Agent";

interface CredentialContextType {
  credentials: CredentialCard[];
  addCredential: () => Promise<void>;
  retrieveCredentials: () => Promise<CredentialCard[]>;
  removeCredential: (hash: string) => Promise<void>;
  removeCredentials: () => Promise<void>;
}

const CredentialContext = createContext<CredentialContextType | undefined>(
  undefined
);

export const useCredentials = (): CredentialContextType => {
  const context = useContext(CredentialContext);
  if (!context) {
    throw new Error("useCredentials must be used within a CredentialProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const CredentialProvider: React.FC<Props> = ({ children }) => {
  const [credentials, setCredentials] = useState<CredentialCard[]>([]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const newCredentials = await agent.dataStoreORMGetVerifiableCredentials(
          {
            order: [{ column: "issuanceDate", direction: "DESC" }],
          }
        );
        if (newCredentials.length === 0) {
        } else if (newCredentials.length !== credentials.length) {
          setCredentials(newCredentials);
        }
      } catch (error) {
        console.error("Error fetching credentials from Agent database:", error);
      }
    };

    fetchCredentials();
  }, []);

  const addCredential = async () => {
    try {
      const newCredentials = await agent.dataStoreORMGetVerifiableCredentials({
        order: [{ column: "issuanceDate", direction: "DESC" }],
      });
      if (newCredentials.length === 0) {
        console.log("There is no new credentials");
      } else if (newCredentials.length !== credentials.length) {
        setCredentials(newCredentials);
      }
    } catch (error) {
      console.error("Error saving credential to AsyncStorage:", error);
    }
  };

  const retrieveCredentials = async (): Promise<CredentialCard[]> => {
    try {
      return credentials;
    } catch (error) {
      console.error("Error retrieving credentials:", error);
      return [];
    }
  };

  const removeCredentials = async () => {
    try {
      const Credentials = await agent.dataStoreORMGetVerifiableCredentials();
      // iterate and remove all credentials
      for (const credential of Credentials) {
        await agent.dataStoreDeleteVerifiableCredential({
          hash: credential.hash,
        });
      }
      setCredentials([]);
      alert("Credentials removed");
    } catch (error) {
      console.error("Error removing credential from Agent database:", error);
    }
  };

  const removeCredential = async (hash: string) => {
    try {
      await agent.dataStoreDeleteVerifiableCredential({
        hash: hash,
      });
      const updatedCredentials = credentials.filter(credential => credential.hash !== hash);
      setCredentials(updatedCredentials);
      alert("Credential removed");
    } catch (error) {
      console.error("Error removing credential from Agent database:", error);
    }
  };

  return (
    <CredentialContext.Provider
      value={{
        credentials,
        addCredential,
        retrieveCredentials,
        removeCredential,
        removeCredentials,
      }}
    >
      {children}
    </CredentialContext.Provider>
  );
};
