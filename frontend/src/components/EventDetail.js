import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const EventDetail = () => {
  const { eventId } = useParams();
  const { user, authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${eventId}`);
      setEvent(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching event:", err.response?.data || err.message);
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        alert("Event deleted successfully!");
        navigate("/events"); // Redirect to events list
      } catch (err) {
        console.error(
          "Error deleting event:",
          err.response?.data || err.message
        );
        alert(err.response?.data?.msg || "Failed to delete event.");
      }
    }
  };

  const handleRSVP = async () => {
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

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!event) return <div className="container mt-5">Event not found.</div>;

  return (
    <div className="container mt-5">
      <h2>{event.title}</h2>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      <button onClick={handleRSVP} className="btn btn-success mr-2">
        RSVP
      </button>

      {/* Delete Button for Admins */}
      {user && user.isAdmin && (
        <button
          onClick={() => navigate(`/admin/events/${eventId}/edit`)}
          className="btn btn-info"
        >
          Edit Event
        </button>
      )}
      {user && user.isAdmin && (
        <button onClick={handleDelete} className="btn btn-danger">
          Delete Event
        </button>
      )}
    </div>
  );
};

export default EventDetail;
