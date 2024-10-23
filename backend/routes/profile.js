const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", auth, async (req, res) => {
  res.json(req.user);
});

// @route   PUT /api/profile
// @desc    Update user's profile
// @access  Private
router.put("/", auth, async (req, res) => {
  const { bio } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (bio) user.profile.bio = bio;

    // Update other profile fields as needed

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
