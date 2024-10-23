const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const adminAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ msg: "User not found, authorization denied" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ msg: "Access denied: Admins only" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin auth middleware error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = adminAuth;
