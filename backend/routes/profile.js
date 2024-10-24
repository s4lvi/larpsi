// routes/profile.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user.profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/profile
// @desc    Update user's profile
// @access  Private (regular users can update their own profile; admins can update any profile)
router.put("/", auth, async (req, res) => {
  const { bio, characterName, class: userClass, race, userId } = req.body;

  // Build profile object
  const profileFields = {};
  if (bio) profileFields.bio = bio;
  if (characterName) profileFields.characterName = characterName;
  if (userClass) profileFields.class = userClass;
  if (race) profileFields.race = race;
  // Do not allow updating money and gear through this endpoint

  try {
    let userToUpdate;

    if (req.user.isAdmin && userId) {
      // Admin updating another user's profile
      userToUpdate = await User.findById(userId);
      if (!userToUpdate) {
        return res.status(404).json({ msg: "User not found" });
      }
    } else {
      // Regular user updating their own profile
      userToUpdate = await User.findById(req.user.id);
      if (!userToUpdate) {
        return res.status(404).json({ msg: "User not found" });
      }
    }

    // Update the profile fields
    userToUpdate.profile = { ...userToUpdate.profile, ...profileFields };
    await userToUpdate.save();

    res.json(userToUpdate.profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
