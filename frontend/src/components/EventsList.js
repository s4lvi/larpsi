import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const { authToken, user } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error(
        "Error fetching events:",
        err.response?.data || err.message
      );
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      if (authToken) {
        // If user is logged in, send authenticated RSVP
        await axios.post(
          `/api/rsvp/${eventId}`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
      } else {
        // If not logged in, prompt for name and email
        const name = prompt("Enter your name:");
        const email = prompt("Enter your email:");
        if (name && email) {
          await axios.post(`/api/rsvp/${eventId}`, { name, email });
        } else {
          alert("Name and Email are required to RSVP.");
        }
      }
      alert("RSVP successful!");
    } catch (err) {
      console.error("Error RSVPing:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "RSVP failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="list-group">
          {events.map((event) => (
            <div
              key={event._id}
              className="list-group-item flex-column align-items-start"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{event.title}</h5>
                <small>{new Date(event.date).toLocaleString()}</small>
              </div>
              <p className="mb-1">{event.description.substring(0, 100)}...</p>
              <div className="mt-2">
                <Link
                  to={`/events/${event._id}`}
                  className="btn btn-primary btn-sm mr-2"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleRSVP(event._id)}
                  className="btn btn-success btn-sm"
                >
                  RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
