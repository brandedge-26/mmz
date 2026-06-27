import { verifyAccessToken } from "../utils/tokens.js";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Authentication required.", { cause: { statusCode: 401 } });
    }

    const token   = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new Error("User not found.", { cause: { statusCode: 401 } });
    }

    req.user = user;
    next();
  } catch (err) {
    if (!err.cause) err.cause = { statusCode: 401 };
    next(err);
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
};
