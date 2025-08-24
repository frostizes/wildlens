import { createContext, useContext, useState, ReactNode } from "react";

// Define allowed tab names
export type TabName = "explore" | "map" | "picture" | "profile";

// Define context type
interface NavContextType {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

// Create context with null initial value
const NavContext = createContext<NavContextType | null>(null);

// Provider component
interface NavProviderProps {
  children: ReactNode;
}

export const NavProvider = ({ children }: NavProviderProps) => {
  const [activeTab, setActiveTab] = useState<TabName>("explore");

  return (
    <NavContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NavContext.Provider>
  );
};

// Custom hook for easier usage
export const useNav = (): NavContextType => {
  const context = useContext(NavContext);
  if (!context) throw new Error("useNav must be used within a NavProvider");
  return context;
};
