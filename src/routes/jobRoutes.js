const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
} = require("../controllers/jobController");
const {
  createJobValidation,
  updateJobValidation,
} = require("../middleware/validation");

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Public
router.get("/", getJobs);

// @route   GET /api/jobs/stats
// @desc    Get job statistics
// @access  Public
router.get("/stats", getJobStats);

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get("/:id", getJob);

// @route   POST /api/jobs
// @desc    Create new job
// @access  Public (should be protected with auth in production)
router.post("/", createJobValidation, createJob);

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Public (should be protected with auth in production)
router.put("/:id", updateJobValidation, updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Public (should be protected with auth in production)
router.delete("/:id", deleteJob);

module.exports = router;
