// context/MyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context value type
interface MyContextType {
  orgInfo: any;
  setOrgInfo: (value: any) => void;
}

// Create the context with a default value
const MyContext = createContext<MyContextType | undefined>(undefined);

// Create a provider component
interface MyProviderProps {
  children: ReactNode;
}

export const OrgContext: React.FC<MyProviderProps> = ({ children }) => {
  const [orgInfo, setState] = useState([]);

  const setOrgInfo = (value: any) => setState(value);

  return (
    <MyContext.Provider value={{ orgInfo, setOrgInfo }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context
export const useOrgInfoContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
