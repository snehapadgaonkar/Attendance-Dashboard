const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  No: Number,
  Name: String,
  present: Number,
  total: Number,
});

const studentMonthSchema = new mongoose.Schema({
  month: String,
  Attendance: [attendanceSchema], // Embedded documents array
});

module.exports = mongoose.model('StudentMonth', studentMonthSchema);
