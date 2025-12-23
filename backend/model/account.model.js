const mongoose = require('mongoose');
require("dotenv").config();
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true
  },
  balance: {
    type: Number,
    required: true
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockTimestamp: {
    type: Date
  }
});

module.exports = mongoose.model("Account",accountSchema)