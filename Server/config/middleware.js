const jwt = require("jsonwebtoken");

const authmiddleware = async (req, res, next) => {
  const token = req.cookies.token; // ✅ get from cookie

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authmiddleware;
