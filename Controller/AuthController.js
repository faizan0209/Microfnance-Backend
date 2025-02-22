const userModel = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup handler
const signup = async (req, res) => {
  try {
    const { name, email,password, role } = req.body;

    // Check if the user already exists by email
    const existingUser = await userModel.findOne({
      $or: [{ email }],
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User with the provided email  already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let assignedRole = "user"; // Default role
    if (role === "admin") {
      return res.status(403).json({ message: "Cannot register as admin directly" });
    }

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: assignedRole
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
        password: newUser.password,
        role: newUser.assignedRole
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

// Login handler
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists by email
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
      { email: existingUser.email, id: existingUser._id, role: existingUser.role }, // Include role in token
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "24h" }
    );

    console.log("token", jwtToken);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
    });

    // Respond with success
    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role, // Send role in response
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

const checkUser = async(req,res)=>{
  const token = req.cookies?.jwtToken;
  console.log("Cookies received:", req.cookies);
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  });
}

// Fetch all registered users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 }); // Exclude passwords
    res.status(200).json({ users, success: true });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Remove a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Prevent deletion if the user is an admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot be deleted!", success: false });
    }

    // Delete user if not an admin
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully", success: true });

  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};


// Promote a user to admin
const promoteUserToAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await userModel.findByIdAndUpdate(id, { role: "admin" }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "User promoted to admin successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error promoting user:", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const logOut = async(req,res)=>{
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}


module.exports = {
  signup,
  login,
  getAllUsers,
  deleteUser,
  promoteUserToAdmin,
  checkUser,
  logOut
};
