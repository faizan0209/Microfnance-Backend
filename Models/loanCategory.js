const mongoose = require("mongoose");

const loanCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    interestRate: {  // Added interest rate field
        type: Number,
        required: true,
        min: 0
    }
});

const LoanCategory = mongoose.model("LoanCategory", loanCategorySchema);

module.exports = LoanCategory;
