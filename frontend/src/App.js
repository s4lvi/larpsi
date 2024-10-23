import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Navbar from "../../frontend/src/components/Navbar";
import LandingPage from "../../frontend/src/components/LandingPage";
import Signup from "../../frontend/src/components/Signup";
import Login from "../../frontend/src/components/Login";
import Profile from "../../frontend/src/components/Profile";
import Event from "../../frontend/src/components/Event";
import PrivateRoute from "../../frontend/src/components/PrivateRoute";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/events/:eventId" component={Event} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
