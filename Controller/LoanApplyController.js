const mongoose = require('mongoose');
const LoanCategory = require('../Models/loanCategory'); 
const Loan = require('../Models/loanApply'); 
const User = require('../Models/users')

const requestLoan = async (req, res) => {
    try {
        console.log("🔹 req.user:", req.user);  // Debugging

        const {amount, loanCategory, interestRate, months } = req.body;
        const userId = req.user?.id || req.user?._id;  // Handle both cases

        if (!userId) {
            console.error("❌ User ID not found in req.user");
            return res.status(400).json({ message: "User not authenticated" });
        }

        console.log("✅ User ID:", userId); // Debugging

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        // Fetch loan category
        const category = await LoanCategory.findOne({ name: loanCategory });
        if (!category) {
            return res.status(400).json({ message: "Loan category not found" });
        }

        // Calculate Total Payment
        const totalPayment = amount * (1 + (interestRate * months) / (100 * 12));
        const roundedTotalPayment = parseFloat(totalPayment.toFixed(2));

        console.log("💰 Total Payment:", roundedTotalPayment);

        // Create Loan Request (including remainingAmount)
        const loanRequest = new Loan({
            userId, 
            userName: user.name, 
            amount,
            loanCategory: category.name,  
            interestRate,
            months,
            totalPayment: roundedTotalPayment,
            duePayment: roundedTotalPayment, // Set remainingAmount equal to totalPayment initially
            status: "Pending", // Default status for new loan requests
        });

        await loanRequest.save();

        const populatedLoanRequest = await Loan.findById(loanRequest._id).populate('userId', 'name email');

        res.status(201).json({ 
            message: "Loan requested successfully", 
            loanRequest: populatedLoanRequest 
        });
    } catch (error) {
        console.error("❌ Loan Request Error:", error.message);
        res.status(500).json({ message: "Error requesting loan", error: error.message });
    }
};






const updateLoanStatus = async (req, res) => {
  try {
      const { loanId, status } = req.body;

      // Validate status
      if (!["approved", "rejected"].includes(status)) {
          return res.status(400).json({ message: "Invalid status value" });
      }

      // Find loan application by ID
      const loan = await Loan.findById(loanId);
      if (!loan) {
          return res.status(404).json({ message: "Loan application not found" });
      }

      // Update loan status
      loan.status = status;
      await loan.save();

      res.status(200).json({ message: `Loan application ${status}`, loan });
  } catch (error) {
      console.error("Error updating loan status:", error.message);
      res.status(500).json({ message: "Error updating loan status", error: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
      // Fetch all loan applications from the database
      const applications = await Loan.find().sort({ createdAt: -1 }); // Sorting by latest first

      res.status(200).json( applications );
  } catch (error) {
      console.error("Error fetching applications:", error.message);
      res.status(500).json({ message: "Error fetching applications", error: error.message });
  }
};

module.exports = { requestLoan,getAllApplications, updateLoanStatus };
