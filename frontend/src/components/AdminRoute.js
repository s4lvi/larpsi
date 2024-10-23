import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log("adminroute", user);
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
