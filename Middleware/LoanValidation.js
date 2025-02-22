const Joi = require('joi');

const loanRequestValidation = (req, res, next) => {
    const schema = Joi.object({
        amount: Joi.number().min(100000).positive().required().messages({
            'number.base': 'Amount should be a number',
            'number.positive': 'Amount must be a positive number',
            'any.required': 'Amount is required',
        }),
        loanCategory: Joi.string().trim().min(3).max(50).required().messages({
            'string.empty': 'Loan category is required',
            'string.min': 'Loan category name must be at least 3 characters long',
            'string.max': 'Loan category name cannot exceed 50 characters',
        }),
        interestRate: Joi.number().min(0).max(100).required().messages({
            'number.base': 'Interest rate should be a number',
            'number.min': 'Interest rate cannot be negative',
            'number.max': 'Interest rate cannot exceed 100%',
            'any.required': 'Interest rate is required',
        }),
        months: Joi.number().min(5).max(24).integer().positive().required().messages({
            'number.base': 'Months should be an integer number',
            'number.positive': 'Months must be a positive number',
            'any.required': 'Months is required',
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: 'Validation Error',
            errors: error.details.map((detail) => detail.message),
        });
    }

    next(); // If validation is successful, proceed to the controller
};

module.exports = { loanRequestValidation };
