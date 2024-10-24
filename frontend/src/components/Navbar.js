// Navbar.jsx
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
          data-bs-toggle="collapse" // Updated
          data-bs-target="#navbarNav" // Updated
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
            <li className="nav-item">
              <NavLink exact className="nav-link" to="/profiles">
                Characters
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
                  data-bs-toggle="dropdown" // Updated
                  aria-expanded="false" // Bootstrap 5 uses aria-expanded without "aria-haspopup"
                >
                  Admin
                </a>
                <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                  <li>
                    <NavLink className="dropdown-item" to="/admin/events/new">
                      Add Event
                    </NavLink>
                  </li>
                  {/* Future links for updating/deleting events can be added here */}
                </ul>
              </li>
            )}
          </ul>

          {/* Right Side Links */}
          <ul className="navbar-nav ms-auto">
            {" "}
            {/* Changed ml-auto to ms-auto for Bootstrap 5 */}
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
                  <NavLink className="nav-link" to="/account">
                    Account
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
