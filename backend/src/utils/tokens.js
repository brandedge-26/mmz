import jwt from "jsonwebtoken";
import { ENV } from "../config/envs.js";

export const generateAccessToken = (payload) =>
  jwt.sign(payload, ENV.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
  } catch {
    throw new Error("Invalid or expired access token", { cause: { statusCode: 401 } });
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
  } catch {
    throw new Error("Invalid or expired refresh token", { cause: { statusCode: 401 } });
  }
};
