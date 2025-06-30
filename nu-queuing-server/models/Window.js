const mongoose = require("mongoose");

const windowSchema = new mongoose.Schema({
  windowNumber: { type: String, required: true },
  department: { type: String, required: true },
  transaction: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Window", windowSchema);
