const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const Event = require("../models/Event");

// @route   POST /api/admin/events
// @desc    Create a new event
// @access  Private/Admin
router.post("/events", adminAuth, async (req, res) => {
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

// @route   PUT /api/admin/events/:id
// @desc    Update an existing event
// @access  Private/Admin
router.put("/events/:id", adminAuth, async (req, res) => {
  const { title, description, date } = req.body;

  // Build event object
  const eventFields = {};
  if (title) eventFields.title = title;
  if (description) eventFields.description = description;
  if (date) eventFields.date = date;

  try {
    console.log(req);
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/admin/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete("/events/:id", adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    await Event.findByIdAndRemove(req.params.id);

    res.json({ msg: "Event removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
