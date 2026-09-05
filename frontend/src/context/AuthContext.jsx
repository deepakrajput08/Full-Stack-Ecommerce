import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUser = (userData) => {
    setUserState(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
  localStorage.removeItem("user");
  setUserState(null);
};

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);