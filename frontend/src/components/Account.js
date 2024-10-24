// components/Account.js
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Account = () => {
  const { authToken } = useContext(AuthContext);
  const [account, setAccount] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  const { name, username, email, password, confirmPassword } = formData;

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await axios.get("/api/account", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setAccount(res.data.account);
        setFormData({
          name: res.data.account.name || "",
          username: res.data.account.username || "",
          email: res.data.account.email || "",
          password: "",
          confirmPassword: "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setLoading(false);
      }
    };
    fetchAccount();
  }, [authToken]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for password match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name,
        username,
        email,
      };

      if (password) {
        payload.password = password;
      }

      const res = await axios.put("/api/account", payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setAccount(res.data.account);
      alert("Account updated successfully");
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h2>Your Account</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Your Account</h2>
      <form onSubmit={onSubmit}>
        {/* Name */}
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

        {/* Username */}
        <div className="form-group mt-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group mt-3">
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

        {/* Password */}
        <div className="form-group mt-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group mt-3">
          <label>Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-4">
          Update Account
        </button>
      </form>
    </div>
  );
};

export default Account;
