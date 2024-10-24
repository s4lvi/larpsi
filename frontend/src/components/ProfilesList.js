// components/ProfilesList.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProfilesList = () => {
  const { authToken } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get("/api/profiles", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setProfiles(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [authToken]);

  if (loading) {
    return (
      <div className="container mt-5">
        <h2>All Profiles</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>All Profiles</h2>
      <ul className="list-group">
        {profiles.map((profile) => (
          <Link
            to={`/profiles/${profile.userId}`}
            key={profile.userId}
            className="list-group-item list-group-item-action"
          >
            <strong>{profile.characterName}</strong> ({profile.username})
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ProfilesList;
