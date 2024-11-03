const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin', // Set default role to 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
