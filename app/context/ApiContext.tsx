// context/ApiContext.js
import React, { createContext, useContext } from "react";

// You can load this from .env using expo-constants later
const BASE_URL = "http://192.168.43.65:5000"; // your backend server

const ApiContext = createContext(BASE_URL);

export const ApiProvider = ({ children }) => {
  return (
    <ApiContext.Provider value={BASE_URL}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook for easy usage
export const useApi = () => {
  return useContext(ApiContext);
};
