require('dotenv').config({ path: 'C:/Users/meetu/OneDrive/Desktop/attendance_system/attend/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const Student = require('./model/student.js');
const StudentMonth = require('./model/studentmonths.js'); 
const Admin = require('./model/admins.js');

const app = express();
const PORT = process.env.PORT || 8080;

// Log MongoDB Connection String (for debugging purposes)
console.log('MongoDB Connection String:', process.env.MONGODB_URL);

// Use CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend requests from port 3000
  methods: ['GET', 'POST', 'PATCH'], // Specify allowed methods
  credentials: true, // Enable credentials if needed
}));

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    console.log('Fetched students:', students);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Add a new student
app.post('/api/students', async (req, res) => {
  console.log('Incoming student data:', req.body);
  const student = new Student(req.body);
  try {
    const newStudent = await student.save();
    console.log('Added student:', newStudent);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(400).json({ message: 'Error adding student', error: error.message });
  }
});

// Update student attendance
app.patch('/api/students/:id', async (req, res) => {
  console.log('Updating student with ID:', req.params.id, 'Data:', req.body);
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('Updated student:', student);
    res.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(400).json({ message: 'Error updating student', error: error.message });
  }
});

// Get all student months
app.get('/api/studentmonths', async (req, res) => {
  try {
    const studentMonths = await StudentMonth.find();
    console.log('Fetched student months:', studentMonths);
    res.json(studentMonths);
  } catch (error) {
    console.error('Error fetching student months:', error);
    res.status(500).json({ message: 'Error fetching student months', error: error.message });
  }
});

// Admin login route
app.post('/api/admins/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Login attempt:', { username }); // Log incoming login attempt
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.json({ message: 'Login successful', adminId: admin._id, role: admin.role });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
