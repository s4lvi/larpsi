import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          Home
        </Link>

        {/* Toggler/collapsible Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            {/* Events Link */}
            <li className="nav-item">
              <NavLink exact className="nav-link" to="/events">
                Events
              </NavLink>
            </li>

            {/* Admin Links */}
            {user && user.isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#!"
                  id="adminDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Admin
                </a>
                <div className="dropdown-menu" aria-labelledby="adminDropdown">
                  <NavLink className="dropdown-item" to="/admin/events/new">
                    Add Event
                  </NavLink>
                  {/* Future links for updating/deleting events can be added here */}
                </div>
              </li>
            )}
          </ul>

          {/* Right Side Links */}
          <ul className="navbar-nav ml-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">
                    Sign Up
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Log In
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
