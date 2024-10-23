import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Event = () => {
  const { eventId } = useParams();
  const { authToken } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [rsvpData, setRsvpData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchEvent();
  }, [eventId]);

  const { name, email } = rsvpData;

  const onChange = (e) =>
    setRsvpData({ ...rsvpData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authToken) {
        await axios.post(
          `/api/rsvp/${eventId}`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
      } else {
        await axios.post(`/api/rsvp/${eventId}`, rsvpData);
      }
      alert("RSVP successful");
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg || "RSVP failed");
    }
  };

  if (!event) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>{event.title}</h2>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>{event.description}</p>

      <h4>RSVP</h4>
      <form onSubmit={onSubmit}>
        {!authToken && (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary mt-3">
          RSVP
        </button>
      </form>
    </div>
  );
};

export default Event;
