const Loan = require("../Models/loanApply");
const Transaction = require("../Models/transaction");
const mongoose = require("mongoose");

const makePayment = async (req, res) => {
  try {
    const { loanId, amountPaid } = req.body;
    const userId = req.user?.id || req.user?._id;

    // Validate loanId
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res.status(400).json({ message: "Invalid loanId format" });
    }

    // Validate amountPaid
    const paymentAmount = parseFloat(amountPaid);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const loanObjectId = new mongoose.Types.ObjectId(loanId);

    // Find loan and update remaining amount without changing status
    const loan = await Loan.findOneAndUpdate(
      { _id: loanObjectId, userId, duePayment: { $gt: 0 } },
      { $inc: { duePayment: -paymentAmount } }, // Reduce due amount
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ message: "Loan not found or already fully paid" });
    }

    // Prevent overpayment
    if (loan.duePayment < 0) {
      return res.status(400).json({ message: "Payment exceeds due amount" });
    }

    // Record transaction (but do NOT change loan status)
    const transaction = new Transaction({ userId, loanId: loanObjectId, amountPaid: paymentAmount });
    await transaction.save();

    res.status(200).json({
      message: "Payment successful",
      duePayment: loan.duePayment,
      status: loan.status,  // Status remains unchanged
      transaction,
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error: error.message });
  }
};

const getUserLoans = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found in request" });
      }
  
      const userId = req.user.id;
      console.log("Fetching loans for user:", userId);
  
      // Debug: Log all loans in the database
      const allLoans = await Loan.find();
      console.log("All Loans in DB:", allLoans);
  
      const loans = await Loan.find({ userId });
      console.log("Loans Found:", loans);
  
      if (!loans.length) {
        return res.status(404).json({ message: "No loans found for this user" });
      }
  
      res.status(200).json(loans);
    } catch (error) {
      console.error("Error fetching loans:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  

module.exports = { makePayment, getUserLoans };
