const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },  // Store user name
  // userEmail: { type: String, required: true }, // Store user email
  amount: { type: Number, required: true },
  loanCategory: { type: String, required: true },
  interestRate: { type: Number, required: true },
  months: { type: Number, required: true },
  totalPayment: { type: Number, required: true },
  duePayment: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "approved", "rejected"], default: "Pending" }
});

const loan = mongoose.model("Loan", LoanSchema);
module.exports = loan;
