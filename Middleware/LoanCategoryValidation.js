const Joi = require("joi");

// ✅ Define validation schema for loan category
const loanCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Loan category name is required",
    "string.min": "Loan category name must be at least 3 characters long",
    "string.max": "Loan category name must be less than 50 characters",
  }),
  description: Joi.string().min(5).max(255).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 5 characters long",
    "string.max": "Description must be less than 255 characters",
  }),
  interestRate: Joi.number().min(0).max(100).required().messages({
    "number.base": "Interest rate must be a number",
    "number.min": "Interest rate cannot be negative",
    "number.max": "Interest rate cannot exceed 100%",
    "any.required": "Interest rate is required",
  }),
});

// ✅ Middleware function to validate request data
const validateLoanCategory = (req, res, next) => {
  const { error } = loanCategorySchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};

module.exports = { validateLoanCategory };
