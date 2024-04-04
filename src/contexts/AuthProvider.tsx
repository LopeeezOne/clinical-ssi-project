import { createContext, ReactNode, useContext, useState, FunctionComponent } from 'react';

interface AuthState {
  token: string | null; // For now, I do not use the token
  username: string;
  password: string | null,
  role: string | null,
}

interface AuthContextType {
  user: AuthState;
  login: (username: string, token: string, password: string, role: string) => void;
  logout: () => void;
}

// Initialize the context with a default state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthState>({ token: null, username: "", password: null, role: null });

  const login = (username: string, token: string, password: string, role: string) => {
    setUser({ token, username, password, role });
    // Optionally, save the token and username in secure storage
  };

  const logout = () => {
    setUser({ token: null, username: "", password: null, role: null  });
    // Optionally, clear the token and username from secure storage
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// Hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
