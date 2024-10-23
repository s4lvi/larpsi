import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEvent = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  });

  const { title, description, date } = formData;

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${eventId}`);
      const { title, description, date } = res.data;
      setFormData({
        title,
        description,
        date: new Date(date).toISOString().slice(0, 16), // For datetime-local input
      });
    } catch (err) {
      console.error("Error fetching event:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to fetch event.");
      navigate("/events");
    }
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/admin/events/${eventId}`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Event updated successfully!");
      navigate(`/events/${eventId}`); // Redirect to event detail
    } catch (err) {
      console.error("Error updating event:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to update event.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Event</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={description}
            onChange={onChange}
            rows="5"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            name="date"
            value={date}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Event
        </button>
        <button
          onClick={() => navigate("/events")}
          className="btn btn-secondary mt-3"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;
