const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process?.env?.DB_URI, 
      {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    
    }
    );

    console.log('MongoDB Connected');
    return mongoose.connection;
  } catch (error) {
    
    console.log(error)
    process.exit(1);
  }
};

module.exports = connectDB;