// context/MyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { boolean } from "zod";

// Define the context value type
interface MyContextType {
  IssueOpen: boolean;
  setIssueOpen: (value: boolean) => void;
}

// Create the context with a default value
const MyContext = createContext<MyContextType | undefined>(undefined);

// Create a provider component
interface MyProviderProps {
  children: ReactNode;
}

export const IssueOpener: React.FC<MyProviderProps> = ({ children }) => {
  const [IssueOpen, setState] = useState(false);

  const setIssueOpen = (value: boolean) => setState(value);

  return (
    <MyContext.Provider value={{ IssueOpen, setIssueOpen }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context
export const useIssueOpener = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
