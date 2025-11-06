// context/ApiContext.tsx
import React, { createContext, ReactNode, useContext } from "react";

// Backend URL (can later come from .env)
const BASE_URL = "http://192.168.1.2:5000";

const ApiContext = createContext<string>(BASE_URL);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  return <ApiContext.Provider value={BASE_URL}>{children}</ApiContext.Provider>;
};

// Custom hook to access API base URL
export const useApi = (): string => {
  return useContext(ApiContext);
};
