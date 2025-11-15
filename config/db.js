const mongoose = require('mongoose');

const connectDB = async () => {
  
  console.log("Connecting with URI:", process.env.MONGO_URI); 

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;