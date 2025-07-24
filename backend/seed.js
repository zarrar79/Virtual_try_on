require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to DB:", mongoose.connection.name))
.catch((err) => console.log('Connection error:', err));

// Sample data
const users = [
  { name: "Ali Khan", password: "CS001"},
  { name: "Sara Ahmed", password: "CS002"},
  { name: "Zarrar Shah", password: "CS003"},
];

// Insert data
const seedData = async () => {
  try {
    await User.deleteMany(); // Clean old data
    const result = await User.insertMany(users);
    console.log('Seeded successfully:', result);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    mongoose.disconnect(); // Always close connection
  }
};

seedData();
