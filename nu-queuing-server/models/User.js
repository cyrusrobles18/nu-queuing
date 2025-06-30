const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  type: { type: String, required: true }, // Head, System Admin, Staff
  department: { type: String, required: true }, // Department name
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  password: { type: String, required: true }, 
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('User', userSchema);