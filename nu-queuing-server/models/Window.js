const mongoose = require("mongoose");

const windowSchema = new mongoose.Schema({
  assignedTo: { type: String, default: "" },
  windowNumber: { type: String, required: true },
  department: { type: String, required: true },
  transaction: { type: String, required: true },
  isAssigned: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Window", windowSchema);
