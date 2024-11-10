const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const RSVP = require("../models/RSVP");
const Event = require("../models/Event");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// @route   POST /api/rsvp/:eventId
// @desc    RSVP to an event
// @access  Public (with optional authentication)
router.post("/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { name, email } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    let rsvpData = { event: eventId };

    if (req.headers.authorization) {
      // If user is logged in
      const token = req.header("Authorization").split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET).user;
      console.log("decoded", decoded);
      const user = await User.findById(decoded._id);
      if (user) {
        rsvpData.user = user._id;
      }
    } else {
      // If not logged in, require name and email
      if (!name || !email) {
        return res
          .status(400)
          .json({ msg: "Name and Email are required for RSVP" });
      }
      rsvpData.name = name;
      rsvpData.email = email;
    }

    const newRSVP = new RSVP(rsvpData);
    await newRSVP.save();

    res.json({ msg: "RSVP successful" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/rsvp/:eventId/count
// @desc    Get count of all RSVPs for an event
// @access  Public
router.get("/:eventId/count", async (req, res) => {
  try {
    const count = await RSVP.find({ event: req.params.eventId });
    res.json(count.length);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/rsvp/:eventId
// @desc    Get all RSVPs for an event
// @access  Private (Assuming only admins can view RSVPs)
router.get("/:eventId", auth, async (req, res) => {
  try {
    const rsvps = await RSVP.find({ event: req.params.eventId }).populate(
      "user",
      ["name", "email"]
    );
    res.json(rsvps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
