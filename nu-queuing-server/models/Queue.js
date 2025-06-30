const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  department: { type: String, required: true },
  transaction: { type: String, required: true },
  priority: { type: Boolean, default: false },
  queueNumber: { type: String, required: true }, // Combination of first 3 letter of the transaction
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "Waiting" },
});

module.exports = mongoose.model("Queue", queueSchema);
