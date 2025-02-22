const express = require("express");
const { signup, login, getAllUsers, promoteUserToAdmin, deleteUser, checkUser, logOut } = require("../Controller/AuthController");
const {requestLoan, getAllApplications, updateLoanStatus} = require('../Controller/LoanApplyController');
const {loanRequestValidation} = require('../Middleware/LoanValidation')
const {addLoanCategories,getLoanCategories, editLoanCategory, deleteLoanCategory} = require ('../Controller/LoanCategoryController')
const { signupValidation, loginValidation } = require("../Middleware/AuthValidation");
const { isAuthenticated } = require('../Middleware/auth');  // Correct import
const { validateLoanCategory } = require("../Middleware/LoanCategoryValidation");
const { makePayment, getUserLoans } = require("../Controller/TransactionController");
const { validateMakePayment } = require("../Middleware/MakePaymentValidation");
const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.get("/me", checkUser);
router.post("/logout", logOut)
router.get("/users",getAllUsers);
router.put("/updateUser/:id",promoteUserToAdmin);
router.delete("/deleteUser/:id", deleteUser)
router.post("/add", validateLoanCategory, addLoanCategories); // ✅ Add a loan category
router.get("/category", getLoanCategories); // ✅ Get all loan categories
router.put("/edit/:id", editLoanCategory);
router.delete("/delete/:id", deleteLoanCategory)
router.post ('/request', isAuthenticated, loanRequestValidation, requestLoan);
router.get('/request/fetch', getAllApplications)
router.put('/request/status', updateLoanStatus)
router.post("/pay", isAuthenticated, validateMakePayment, makePayment)
router.get("/userLoans", isAuthenticated, getUserLoans)

module.exports = router;
