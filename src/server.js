const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import custom middleware
const { errorHandler, notFound, logger } = require("./middleware/errorHandler");

// Import database connection
const { connectDB } = require("./config/database");

// Import routes
const jobRoutes = require("./routes/jobs");

// Create Express app
const app = express();

// Connect to database (non-blocking)
connectDB().catch((err) => {
  console.log("Database connection failed, but server will continue...");
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:8080",
      "http://localhost:3000", // Common React dev server
      "http://localhost:5173", // Vite dev server
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(logger);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Board API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  });
});

// Debug endpoint (only for development/troubleshooting)
app.get("/debug", async (req, res) => {
  const { isDBConnected } = require("./config/database");
  const mongoose = require("mongoose");

  // Try to get more detailed connection info
  let connectionTest = null;
  try {
    // Test connection manually with quick timeout
    const testConnection = await mongoose.createConnection(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds for quick test
    });
    connectionTest = {
      success: true,
      host: testConnection.host,
      name: testConnection.name
    };
    await testConnection.close();
  } catch (error) {
    connectionTest = {
      success: false,
      error: error.message,
      errorCode: error.code || 'unknown',
      errorName: error.name || 'unknown'
    };
  }

  res.status(200).json({
    success: true,
    message: "Debug information",
    environment: process.env.NODE_ENV,
    database: {
      connected: isDBConnected(),
      readyState: mongoose.connection.readyState,
      readyStateDescription: {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
      }[mongoose.connection.readyState],
      host: mongoose.connection.host || "not connected",
      name: mongoose.connection.name || "not connected",
      connectionTest: connectionTest
    },
    env_check: {
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      mongodb_uri_length: process.env.MONGODB_URI?.length || 0,
      mongodb_uri_starts_with:
        process.env.MONGODB_URI?.substring(0, 20) + "..." || "undefined",
      uri_includes_db_name: process.env.MONGODB_URI?.includes('/jobboard') || false
    },
    vercel_info: {
      vercel_env: process.env.VERCEL_ENV || 'not vercel',
      vercel_region: process.env.VERCEL_REGION || 'unknown'
    },
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/jobs", jobRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Job Board API",
    documentation: "/api/docs",
    health: "/health",
    endpoints: {
      jobs: {
        "GET /api/jobs": "Get all jobs with filtering and pagination",
        "GET /api/jobs/:id": "Get single job by ID",
        "POST /api/jobs": "Create new job",
        "PUT /api/jobs/:id": "Update job by ID",
        "DELETE /api/jobs/:id": "Delete job by ID",
        "GET /api/jobs/stats": "Get job statistics",
      },
    },
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Job Board API Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || "development"}
📊 Health Check: http://localhost:${PORT}/health
📚 API Docs: http://localhost:${PORT}/
🔗 Jobs API: http://localhost:${PORT}/api/jobs
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = app;
