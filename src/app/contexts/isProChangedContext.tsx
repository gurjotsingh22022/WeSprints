// context/MyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context value type
interface MyContextType {
  isChanged: boolean;
  setIsChanged: (value: boolean) => void;
}

// Create the context with a default value
const MyContext = createContext<MyContextType | undefined>(undefined);

// Create a provider component
interface MyProviderProps {
  children: ReactNode;
}

export const IsProChanged: React.FC<MyProviderProps> = ({ children }) => {
  const [isChanged, setState] = useState(false);

  const setIsChanged = (value: boolean) => setState(value);

  return (
    <MyContext.Provider value={{ isChanged, setIsChanged }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context
export const useProChanged = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
