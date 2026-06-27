import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/tokens.js";
import { ENV } from "../config/envs.js";

const REFRESH_COOKIE = {
  httpOnly: true,
  secure:   ENV.NODE_ENV === "production",
  sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
};

const safeUser = (user) => ({
  id:    user._id,
  name:  user.name,
  email: user.email,
  role:  user.role,
});


// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0].message, { cause: { statusCode: 400 } });
    }

    const { name, email, password } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) {
      throw new Error("Email already registered", { cause: { statusCode: 409 } });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed });

    const payload      = { id: user._id, email: user.email, role: user.role };
    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE);

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      accessToken,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};


// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0].message, { cause: { statusCode: 400 } });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password", { cause: { statusCode: 401 } });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid email or password", { cause: { statusCode: 401 } });
    }

    const payload      = { id: user._id, email: user.email, role: user.role };
    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};


// POST /api/auth/admin-login
export const adminLogin = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0].message, { cause: { statusCode: 400 } });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password", { cause: { statusCode: 401 } });
    }

    if (user.role !== "admin") {
      throw new Error("Access denied. Admins only.", { cause: { statusCode: 403 } });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid email or password", { cause: { statusCode: 401 } });
    }

    const payload      = { id: user._id, email: user.email, role: user.role };
    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE);

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      accessToken,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};


// POST /api/auth/logout
export const logout = (req, res, next) => {
  try {
    res.clearCookie("refreshToken", REFRESH_COOKIE);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};


// GET /api/auth/refresh
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new Error("Refresh token missing. Please login again.", { cause: { statusCode: 401 } });
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new Error("User not found. Please login again.", { cause: { statusCode: 401 } });
    }

    const payload        = { id: user._id, email: user.email, role: user.role };
    const newAccess      = generateAccessToken(payload);
    const newRefresh     = generateRefreshToken(payload);

    res.cookie("refreshToken", newRefresh, REFRESH_COOKIE);

    return res.status(200).json({
      success: true,
      accessToken: newAccess,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};


// GET /api/auth/me  (protected)
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, user: safeUser(req.user) });
  } catch (err) {
    next(err);
  }
};
