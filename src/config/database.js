const mongoose = require("mongoose");

// Check if database is connected
const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("⚠️  Server will continue running without database connection");
    console.log("💡 To fix this, either:");
    console.log("   1. Install and start MongoDB locally: mongod");
    console.log("   2. Use Docker: docker run -d -p 27017:27017 mongo");
    console.log("   3. Update MONGODB_URI in .env to use MongoDB Atlas");

    // Don't exit the process - let the server continue running
    return null;
  }
};

module.exports = { connectDB, isDBConnected };
