// routes/account.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @route   GET /api/account
// @desc    Get current user's account info
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      account: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/account
// @desc    Update current user's account info
// @access  Private
router.put("/", auth, async (req, res) => {
  const { name, username, email, password } = req.body;

  // Build account object
  const accountFields = {};
  if (name) accountFields.name = name;
  if (username) accountFields.username = username;
  if (email) accountFields.email = email;
  if (password) accountFields.password = password;

  try {
    let user = await User.findById(req.user.id);

    if (user) {
      // Check if username or email is being updated to an existing one
      if (username && username !== user.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ msg: "Username already exists" });
        }
      }

      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ msg: "Email already exists" });
        }
      }

      // Update account fields
      if (password) {
        const salt = await bcrypt.genSalt(10);
        accountFields.password = await bcrypt.hash(password, salt);
      }

      user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: accountFields },
        { new: true, runValidators: true }
      ).select("-password");

      return res.json({
        account: {
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });
    }

    res.status(404).json({ msg: "User not found" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
