const mongoose = require("mongoose");
require("dotenv").config();

const transactionSchema = new mongoose.Schema({
    fromName: {
        type: String,   // FIXED
        index: true
    },
    from: {
        type: String,
    },
    toName: {
        type: String,   // FIXED
        required: true,
        index: true
    },
    to: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number,
        required: true,
        index: true
    }
});

module.exports = mongoose.model("Transaction",transactionSchema);
