// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem("user"));
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_WILD_LENS_BACKEND_BASE_URL;

  // Restore from localStorage on mount

  // Optionally verify with backend
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        let validToken = savedToken;

        if (isTokenExpired(savedToken)) {
          validToken = await refreshToken(savedToken);
        }

        if (validToken) {
          setToken(validToken);
          setIsAuthenticated(true);
          if (savedUser) setUser(savedUser);
        }
      }
    };

    initAuth();
  }, [API_BASE_URL]);


    // 🔹 Helper: decode JWT payload (without validation)
  const decodeJWT = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  // 🔹 Check if token expired
  const isTokenExpired = (token) => {
    const decoded = decodeJWT(token);
    if (!decoded?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  };

    // 🔹 Refresh token (example: adjust API endpoint to yours)
  const refreshToken = async (oldToken) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${oldToken}` }, withCredentials: true }
      );

      const newToken = response.data.token;
      setToken(newToken);
      localStorage.setItem("authToken", newToken);
      return newToken;
    } catch (err) {
      console.error("Failed to refresh token", err);
      logout();
      return null;
    }
  };

  const checkAuthStatus = async () => {

  };

  const login = ({userName, token}) => {
    setUser(userName);
    setIsAuthenticated(true);
    setToken(token);
    localStorage.setItem("user", userName);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false); // 👈 update here immediately
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, token }}>
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
