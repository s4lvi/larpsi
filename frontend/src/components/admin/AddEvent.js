import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  });

  const { title, description, date } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/events", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Event added successfully!");
      navigate("/events"); // Redirect to events list
    } catch (err) {
      console.error("Error adding event:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to add event.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Event</h2>
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
          Add Event
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
