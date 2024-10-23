import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      <h1>Welcome to Our Event Registration</h1>
      <p>Check out our upcoming events below:</p>
      <div className="list-group">
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
    </div>
  );
};

export default LandingPage;
