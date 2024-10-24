// components/ProfileDetail.js
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProfileDetail = () => {
  const { authToken, user } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    bio: "",
    characterName: "",
    class: "",
    race: "",
    money: 0,
    gear: [],
    username: "",
  });
  const [editableProfile, setEditableProfile] = useState({
    bio: "",
    characterName: "",
    class: "",
    race: "",
  });
  const [loading, setLoading] = useState(true);

  // Determine if the current user can edit this profile
  const isOwnProfile = user && user.userId === userId;
  const canEdit = user && (isOwnProfile || user.isAdmin);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profiles/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setProfile(res.data);
        if (canEdit) {
          setEditableProfile({
            bio: res.data.bio || "",
            characterName: res.data.characterName || "",
            class: res.data.class || "",
            race: res.data.race || "",
          });
        }
        setLoading(false);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authToken, userId, canEdit]);

  const onChange = (e) =>
    setEditableProfile({ ...editableProfile, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editableProfile };
      if (user.isAdmin && !isOwnProfile) {
        payload.userId = userId; // Allow admin to update other users' profiles
      }
      const res = await axios.put("/api/profile", payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfile(res.data);
      alert("Profile updated successfully");
      if (!isOwnProfile) {
        navigate(`/profiles/${userId}`); // Refresh the page with updated data
      }
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h2>Profile</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Character Name */}
      <h2>{profile.characterName}</h2>

      {/* Username */}
      <h5 className="text-muted">({profile.username})</h5>

      {/* Edit Form */}
      {canEdit && (
        <form onSubmit={onSubmit} className="mt-4">
          {/* Character Name */}
          <div className="form-group mt-3">
            <label>Character Name</label>
            <input
              type="text"
              className="form-control"
              name="characterName"
              value={editableProfile.characterName}
              onChange={onChange}
            />
          </div>

          {/* Class */}
          <div className="form-group mt-3">
            <label>Class</label>
            <input
              type="text"
              className="form-control"
              name="class"
              value={editableProfile.class}
              onChange={onChange}
            />
          </div>

          {/* Race */}
          <div className="form-group mt-3">
            <label>Race</label>
            <input
              type="text"
              className="form-control"
              name="race"
              value={editableProfile.race}
              onChange={onChange}
            />
          </div>

          {/* Bio */}
          <div className="form-group mt-3">
            <label>Bio</label>
            <textarea
              className="form-control"
              name="bio"
              value={editableProfile.bio}
              onChange={onChange}
              rows="3"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary mt-4">
            Update Profile
          </button>
        </form>
      )}
      {/* Bio */}
      {!canEdit && (
        <>
          <div className="mt-3">
            <h4>Bio</h4>
            <p>{profile.bio || "No bio available."}</p>
          </div>

          <div className="mt-3">
            <h4>Character Details</h4>
            <p>
              <strong>Class:</strong> {profile.class || "N/A"}
            </p>
            <p>
              <strong>Race:</strong> {profile.race || "N/A"}
            </p>
          </div>
        </>
      )}

      {/* Money and Gear */}
      <div className="mt-3">
        <h4>Resources</h4>
        <p>
          <strong>Money:</strong> {profile.money}
        </p>

        <div className="mt-2">
          <strong>Gear:</strong>
          {profile.gear && profile.gear.length > 0 ? (
            <ul className="list-group mt-1">
              {profile.gear.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p>No gear available.</p>
          )}
        </div>
      </div>

      {/* Read-Only Message */}
      {!canEdit && (
        <p className="mt-4 text-muted">
          Only the profile owner or an admin can edit this profile.
        </p>
      )}
    </div>
  );
};

export default ProfileDetail;
