const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
