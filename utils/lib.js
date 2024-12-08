const jsonwebtoken = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }
  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);

    req.user = decoded; // Attach decoded user information to the request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const createJWTToken = (payload, expiresIn = "30d") => {
  const signedToken = jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn,
  });

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
};

const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Access the role from the decoded JWT

    if (!userRole) {
      return res.status(403).json({ message: "Forbidden: No role assigned" });
    }

    // Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }

    next(); // Allow the user to proceed to the requested endpoint
  };
};

module.exports = {
  createJWTToken,
  authorizeRoles,
  verifyToken,
};
