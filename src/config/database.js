const mongoose = require("mongoose");

// Check if database is connected
const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

const connectDB = async () => {
  try {
    // Set mongoose options for better cloud database handling
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Full error:", error);

    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("getaddrinfo")
    ) {
      console.log(
        "🌐 Network connectivity issue - check your internet connection"
      );
    } else if (error.message.includes("authentication")) {
      console.log(
        "🔐 Authentication failed - check username/password in MONGODB_URI"
      );
    } else if (error.message.includes("timeout")) {
      console.log("⏱️  Connection timeout - check MongoDB Atlas IP whitelist");
    }

    console.log("💡 Troubleshooting tips:");
    console.log(
      "   1. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0 (allow all IPs)"
    );
    console.log("   2. Check username/password in connection string");
    console.log("   3. Ensure database name is included in URI");
    console.log("   4. Verify cluster is running and accessible");

    // Don't exit the process in production - let the server continue running
    if (process.env.NODE_ENV !== "production") {
      return null;
    }

    // In production, we should still try to continue
    return null;
  }
};

module.exports = { connectDB, isDBConnected };
