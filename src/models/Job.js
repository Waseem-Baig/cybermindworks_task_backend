const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // Frontend field: jobTitle
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    // Frontend field: companyName
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    // Logo derived from company name (lowercase)
    logo: {
      type: String,
      trim: true,
      lowercase: true,
    },
    // Frontend field: description (single string, not array)
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    // Default experience (can be added later to frontend)
    experience: {
      type: String,
      default: "1-3 yr Exp",
      trim: true,
    },
    // Frontend field: location
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      lowercase: true,
    },
    // Frontend fields: salaryMin and salaryMax
    salaryMin: {
      type: String,
      required: [true, "Minimum salary is required"],
      trim: true,
    },
    salaryMax: {
      type: String,
      required: [true, "Maximum salary is required"],
      trim: true,
    },
    // Frontend field: jobType
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      trim: true,
      lowercase: true,
    },
    // Frontend field: deadline
    applicationDeadline: {
      type: Date,
      required: false,
      validate: {
        validator: function (v) {
          return !v || v > new Date();
        },
        message: "Application deadline must be in the future",
      },
    },
    status: {
      type: String,
      enum: ["draft", "published", "expired", "closed"],
      default: "published",
    },
    // Metadata
    views: {
      type: Number,
      default: 0,
    },
    applications: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted posted time
jobSchema.virtual("postedTime").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d Ago`;
  } else if (hours > 0) {
    return `${hours}h Ago`;
  } else {
    return "Just now";
  }
});

// Virtual for formatted salary (using salaryMax as main display)
jobSchema.virtual("salary").get(function () {
  return this.salaryMax || this.salaryMin || "Not specified";
});

// Pre-save middleware to set logo based on company name
jobSchema.pre("save", function (next) {
  if (this.company) {
    // Set logo based on company name (lowercase)
    const companyLower = this.company.toLowerCase();
    if (companyLower.includes("amazon")) {
      this.logo = "amazon";
    } else if (companyLower.includes("tesla")) {
      this.logo = "tesla";
    } else {
      this.logo = "generic";
    }
  }
  next();
});

// Index for search functionality
jobSchema.index({
  title: "text",
  company: "text",
  description: "text",
});

// Index for filtering
jobSchema.index({ location: 1, jobType: 1, status: 1 });
jobSchema.index({ createdAt: -1 });

// Middleware to update views
jobSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method to get published jobs with filters
jobSchema.statics.getPublishedJobs = function (filters = {}) {
  const query = { status: "published" };

  // Add filters
  if (filters.location) {
    query.location = new RegExp(filters.location, "i");
  }

  if (filters.jobType) {
    query.jobType = filters.jobType;
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  return this.find(query).sort({ createdAt: -1 });
};

module.exports = mongoose.model("Job", jobSchema);
