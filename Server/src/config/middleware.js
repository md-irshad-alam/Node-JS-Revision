const jwt = require("jsonwebtoken");

const authmiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(req.headers);
  // Check if Authorization header is present and starts with "Bearer "
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or invalid" });
  }

  // Extract token from header

  try {
    // Verify token
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded.id; // or entire decoded object if needed
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

module.exports = authmiddleware;
