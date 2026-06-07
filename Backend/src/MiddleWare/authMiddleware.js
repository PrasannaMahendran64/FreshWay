const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_secret = process.env.JWT_SECRET || "secretkey";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwt_secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid Token: Verification failed" });
    }

    req.user = decoded; // Attach { id, isAdmin } to req.user
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
