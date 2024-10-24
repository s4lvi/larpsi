// routes/profiles.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/profiles
// @desc    Get list of all user profiles (characterName and username)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("username profile.characterName");
    const profiles = users
      .map((user) => ({
        userId: user._id,
        username: user.username,
        characterName: user.profile.characterName,
      }))
      .filter((user) => user.characterName);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/profiles/:userId
// @desc    Get specific user's profile
// @access  Private
router.get("/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      userId: user._id,
      username: user.username,
      ...user.profile, // Spread the profile fields
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
