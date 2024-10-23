import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState(() =>
    authToken ? jwtDecode(authToken) : null
  );

  const login = (token) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(jwtDecode(token).user);
    console.log(jwtDecode(token).user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (authToken) {
      const decoded = jwtDecode(authToken);
      setUser(decoded);
    }
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
