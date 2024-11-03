const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  No: { type: Number, required: true },
  Name: { type: String, required: true },
  Class: { type: String, required: true }, // Ensure this is capitalized if that's how you reference it
  WorkHours: { type: String, required: true },
  late: { type: Number, default: 0 },
  earlyLeave: { type: Number, default: 0 },
  overtime: { type: Number, default: 0 },
  Attendance: { type: String, required: true },
  BT: { type: Number, default: 0 },
  AB: { type: Number, default: 0 },
  L: { type: Number, default: 0 },
  BonusPay: { type: String, required: true },
  Deductions: { type: String, required: true },
  ActualPay: { type: Number, required: true }, // This must be included
  memo: { type: String, default: "NA" },
  Phone: { type: String },
  Email: { type: String },
});


// Export the Student model
module.exports = mongoose.model('Student', studentSchema);
