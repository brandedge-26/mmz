import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { ENV } from "../config/envs.js";

const REFRESH_COOKIE = {
    httpOnly: true,
    secure:   ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    maxAge:   7 * 24 * 60 * 60 * 1000,
};

export const googleAuthSuccess = async (req, res) => {
    try {
        const { _id } = req.user;
        const app     = req.cookies?.oauth_app || "frontend";
        res.clearCookie("oauth_app");

        const user = await User.findById(_id).select("name email role profilePicture");
        if (!user) {
            const base = app === "shop" ? ENV.SHOP_URL : ENV.FRONTEND_URL;
            return res.redirect(`${base}/auth-error?message=User+not+found`);
        }

        const payload      = { id: _id, email: user.email, role: user.role };
        const accessToken  = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE);

        const userPayload = {
            id:             user._id,
            name:           user.name,
            email:          user.email,
            role:           user.role,
            profilePicture: user.profilePicture,
        };

        const base = app === "shop" ? ENV.SHOP_URL : ENV.FRONTEND_URL;
        res.redirect(
            `${base}/auth-success?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(userPayload))}`
        );
    } catch (err) {
        const app     = req.cookies?.oauth_app || "frontend";
        const base    = app === "shop" ? ENV.SHOP_URL : ENV.FRONTEND_URL;
        const message = encodeURIComponent(err.message || "Google authentication failed");
        res.redirect(`${base}/auth-error?message=${message}`);
    }
};

export const googleAuthError = (err, req, res, next) => {
    console.error("Google auth error:", err.message);
    const app     = req.cookies?.oauth_app || "frontend";
    const base    = app === "shop" ? ENV.SHOP_URL : ENV.FRONTEND_URL;
    const message = encodeURIComponent(err.message || "Google authentication failed");
    return res.redirect(`${base}/auth-error?message=${message}`);
};
