import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Account";
import EventsList from "./components/EventsList";
import EventDetail from "./components/EventDetail";
import AddEvent from "./components/admin/AddEvent";
import UpdateEvent from "./components/admin/UpdateEvent";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProfileDetail from "./components/ProfileDetail";
import ProfilesList from "./components/ProfilesList";
import Account from "./components/Account";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Profiles List */}
          <Route
            path="/profiles"
            element={
              <PrivateRoute>
                <ProfilesList />
              </PrivateRoute>
            }
          />

          {/* Individual Profile */}
          <Route
            path="/profiles/:userId"
            element={
              <PrivateRoute>
                <ProfileDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/events/new"
            element={
              <AdminRoute>
                <AddEvent />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/:eventId/edit"
            element={
              <AdminRoute>
                <UpdateEvent />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
