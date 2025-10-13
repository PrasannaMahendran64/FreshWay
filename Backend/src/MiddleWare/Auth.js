const jwt = require("jsonwebtoken");
require("dotenv").config();


const jwt_secret = process.env.JWT_SECRET || "secretkey";

// ✅ Generate token (includes id + isAdmin in payload)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    jwt_secret,
    { expiresIn: "20h" }
  );
};

// ✅ Verify token middleware
const verifyToken = (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid or missing token" });
    }

    const token = tokenHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwt_secret);

    if (!decoded) {
      return res.status(401).json({ message: "Token verification failed" });
    }

    req.user = decoded; // attach { id, isAdmin } to request
    next();
  } catch (error) {
    console.error("JWT Verify Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// ✅ Admin-only middleware
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};





module.exports = {
  generateToken,
  verifyToken,
  isAdmin,
  
};
