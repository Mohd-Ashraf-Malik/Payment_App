const mongoose = require("mongoose");

const idempotencySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  response: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24, // auto-delete after 24 hours
    index: true
  }
});

module.exports = mongoose.model("Idempotency", idempotencySchema);