const Joi = require('joi');

// ✅ Define validation schema for payment
const paymentSchema = Joi.object({
  loanId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Regular expression for ObjectId validation
    .required()
    .messages({
      'string.base': 'loanId must be a valid ObjectId.',
      'string.pattern.base': 'loanId must be a valid 24-character hexadecimal string.',
      'any.required': 'loanId is required.',
    }),
  amountPaid: Joi.number()
  .min(1000)
    .positive()
    .required()
    .messages({
      'number.base': 'amountPaid must be a valid number.',
      'any.required': 'amountPaid is required.',
      'number.positive': 'amountPaid must be a positive number.',
    }),
});

// ✅ Middleware function to validate request data for make payment
const validateMakePayment = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};

module.exports = { validateMakePayment };
