const { body } = require("express-validator");

// Validation rules for creating a job (matching frontend form)
const createJobValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Job title cannot exceed 100 characters"),

  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required"),

  body("location").trim().notEmpty().withMessage("Location is required"),

  body("salaryMin").trim().notEmpty().withMessage("Minimum salary is required"),

  body("salaryMax").trim().notEmpty().withMessage("Maximum salary is required"),

  body("jobType").trim().notEmpty().withMessage("Job type is required"),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Application deadline must be a valid date")
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error("Application deadline must be in the future");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["draft", "published", "expired", "closed"])
    .withMessage("Status must be one of: draft, published, expired, closed"),
];

// Validation rules for updating a job (matching frontend form, all optional)
const updateJobValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Job title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Job title cannot exceed 100 characters"),

  body("company")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Job description cannot be empty"),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty"),

  body("salaryMin")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Minimum salary cannot be empty"),

  body("salaryMax")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Maximum salary cannot be empty"),

  body("jobType")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Job type cannot be empty"),

  body("logo")
    .optional()
    .isIn(["amazon", "tesla", "generic"])
    .withMessage("Logo must be one of: amazon, tesla, generic"),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Application deadline must be a valid date")
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error("Application deadline must be in the future");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["draft", "published", "expired", "closed"])
    .withMessage("Status must be one of: draft, published, expired, closed"),

  body("skills").optional().isArray().withMessage("Skills must be an array"),

  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),

  body("contactEmail")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("applicationUrl")
    .optional()
    .isURL()
    .withMessage("Application URL must be a valid URL"),
];

module.exports = {
  createJobValidation,
  updateJobValidation,
};
