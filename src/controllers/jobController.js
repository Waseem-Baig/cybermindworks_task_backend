const Job = require("../models/Job");
const { validationResult } = require("express-validator");
const { isDBConnected } = require("../config/database");

// @desc    Get all jobs with filtering, searching, and pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    // Check if database is connected
    if (!isDBConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not connected. Please start MongoDB server.",
        error: "Service temporarily unavailable",
      });
    }

    const {
      search,
      location,
      jobType,
      salaryMin,
      salaryMax,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filters = {};

    if (search) filters.search = search;
    if (location) filters.location = location;
    if (jobType) filters.jobType = jobType;
    if (salaryMin) filters.salaryMin = parseInt(salaryMin);
    if (salaryMax) filters.salaryMax = parseInt(salaryMax);

    // Get jobs with filters
    let query = Job.getPublishedJobs(filters);

    // Apply sorting
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;
    query = query.sort(sortObj);

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    // Execute query
    const jobs = await query;

    // Get total count for pagination
    const totalJobs = await Job.countDocuments({ status: "published" });
    const totalPages = Math.ceil(totalJobs / parseInt(limit));

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages,
      currentPage: parseInt(page),
      data: jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Increment view count
    await job.incrementViews();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Public (in production, this should be protected)
const createJob = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Public (in production, this should be protected)
const updateJob = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Public (in production, this should be protected)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Delete job error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Public
const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalApplications: { $sum: "$applications" },
          avgSalaryMin: { $avg: "$salaryRange.min" },
          avgSalaryMax: { $avg: "$salaryRange.max" },
        },
      },
    ]);

    const jobsByType = await Job.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$jobType",
          count: { $sum: 1 },
        },
      },
    ]);

    const jobsByLocation = await Job.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalJobs: 0,
          totalViews: 0,
          totalApplications: 0,
          avgSalaryMin: 0,
          avgSalaryMax: 0,
        },
        jobsByType,
        jobsByLocation,
      },
    });
  } catch (error) {
    console.error("Get job stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching job statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
};
