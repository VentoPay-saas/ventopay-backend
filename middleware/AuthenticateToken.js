import jwt from "jsonwebtoken";
const JWT_SECRET = "sdjhfksld340975394lkvkfo94";

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.token = token;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred during token verification" });
  }
};
