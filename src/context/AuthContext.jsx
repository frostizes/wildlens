// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  // Restore from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Optionally verify with backend
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data.userName); // if backend returns user info
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    fetchAuthStatus();
  }, [API_BASE_URL]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false); // 👈 update here immediately
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
