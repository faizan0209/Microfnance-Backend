const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", authHeader); // Debugging

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("No token provided");
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token); // Debugging

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        console.log("Decoded User:", decoded); // Debugging

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


const requireAdmin = (req, res, next) => {
    console.log("User Data in requireAdmin:", req.user); // Debugging

    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only" });
    }
    next();
};

module.exports = {
    isAuthenticated,
    requireAdmin
};
