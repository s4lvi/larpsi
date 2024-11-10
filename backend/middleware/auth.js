const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.user._id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ msg: "User not found, authorization denied" });
    }
    next();
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
