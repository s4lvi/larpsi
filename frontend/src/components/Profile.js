import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../frontend-old/src/context/AuthContext";

const Profile = () => {
  const { authToken } = useContext(AuthContext);
  const [profile, setProfile] = useState({ bio: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setProfile(res.data.profile);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchProfile();
  }, [authToken]);

  const [formData, setFormData] = useState({
    bio: profile.bio || "",
    // Add more fields as needed
  });

  const { bio } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/profile", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfile(res.data.profile);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.msg || "Update failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Your Profile</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            className="form-control"
            name="bio"
            value={bio}
            onChange={onChange}
            rows="3"
          ></textarea>
        </div>
        {/* Add more fields as needed */}
        <button type="submit" className="btn btn-primary mt-3">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
