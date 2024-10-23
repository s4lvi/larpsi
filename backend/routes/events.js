const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Event = require("../models/Event");

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   POST /api/events
// @desc    Create an event
// @access  Private (Assuming only admins can create events)
router.post("/", auth, async (req, res) => {
  const { title, description, date } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      date,
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
