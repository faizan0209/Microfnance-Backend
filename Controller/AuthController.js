const userModel = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      success: true,
    });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "Invalid Credentials!",
        success: false,
      });
    }

    // Compare the provided password with the hashed password
    const isPassEqual = await bcrypt.compare(password, existingUser.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: "Invalid Credentials!",
        success: false,
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET || "default_secret", // Replace "default_secret" in production
      { expiresIn: "24h" }
    );

    // Respond with success
    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
      token: jwtToken,
      success: true,
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signup,login
};
