// frontend/src/components/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import "./LandingPage.css";

const LandingPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => {
        const upcomingEvents = res.data.filter(
          (event) => new Date(event.date) > new Date()
        );
        setEvents(upcomingEvents);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="landing-page">
      <div className="overlay">
        <div className="content">
          <h1 className="title">
            Though this be madness, yet there is method in it.
          </h1>
          <h2 className="subtitle">Ypsilanti's own LARP group</h2>
          <p className="description">Check out our upcoming events below:</p>
          <div className="list-group events-list">
            {events.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="list-group-item list-group-item-action"
              >
                <h5>{event.title}</h5>
                <p>{new Date(event.date).toLocaleString()}</p>
              </Link>
            ))}
          </div>

          {/* Social Media Links */}
          <div className="social-media">
            <h3>Follow Us</h3>
            <div className="icons">
              <a
                href="https://www.facebook.com/profile.php?id=61566898743610"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/larp_inthepark/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
