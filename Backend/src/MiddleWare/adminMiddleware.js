const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Access Denied: Admins only" });
  }
  next();
};

module.exports = adminMiddleware;
