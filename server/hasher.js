require('dotenv').config({ path: 'C:/Users/meetu/OneDrive/Desktop/attendance_system/attend/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./model/admins'); // Adjust the path as necessary

console.log('MongoDB URL:', process.env.MONGODB_URL); // Check if the URL is loaded

const updatePasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const admins = await Admin.find();

    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log(`Updated password for admin: ${admin.username}`);
    }

    console.log('All passwords have been hashed successfully.');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    mongoose.connection.close();
  }
};

updatePasswords();
