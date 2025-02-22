const loanCategories = require ('../Models/loanCategory')
// ✅ Add a new loan category
const addLoanCategories = async (req, res) => {
    try {
        const { name, description , interestRate } = req.body;
        console.log(req.body)

        // Check if category already exists
        const existingCategory = await loanCategories.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "loan category already exists" });
        }

        // Create a new loan category
        const category = new loanCategories({ name, description , interestRate });
        await category.save();

        res.status(201).json({ message: "loan category added successfully", category });
    } catch (error) {
        console.error("Error adding loan category:", error.message);
        res.status(500).json({ message: "Error adding loan category", error: error.message });
    }
};

// ✅ Get all loan categories
const getLoanCategories = async (req, res) => {
    try {
        const categories = await loanCategories.find(); // Fetch all categories
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching loan categories:", error.message);
        res.status(500).json({ message: "Error fetching loan categories", error: error.message });
    }
};

const editLoanCategory = async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from params
        const { name, description, interestRate } = req.body; // Get the updated data from body

        // Find the category by ID
        const category = await loanCategories.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Loan category not found" });
        }

        // Update the category with new data
        category.name = name || category.name;
        category.description = description || category.description;
        category.interestRate = interestRate || category.interestRate;

        await category.save();

        res.status(200).json({ message: "Loan category updated successfully", category });
    } catch (error) {
        console.error("Error updating loan category:", error.message);
        res.status(500).json({ message: "Error updating loan category", error: error.message });
    }
};

// ✅ Delete a loan category
const deleteLoanCategory = async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from params

        // Find the category by ID and delete it
        const result = await loanCategories.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Loan category not found" });
        }

        res.status(200).json({ message: "Loan category deleted successfully" });
    } catch (error) {
        console.error("Error deleting loan category:", error.message);
        res.status(500).json({ message: "Error deleting loan category", error: error.message });
    }
};


module.exports = { addLoanCategories, getLoanCategories , editLoanCategory,deleteLoanCategory};
