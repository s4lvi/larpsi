const mongoose = require("mongoose");

const RSVPSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: function () {
      return !this.user;
    },
  },
  email: {
    type: String,
    required: function () {
      return !this.user;
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RSVP", RSVPSchema);
