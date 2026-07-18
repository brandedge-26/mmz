import { Router } from "express";
import passport from "../passport/auth.passport.js";
import {
  register,
  login,
  adminLogin,
  logout,
  refreshToken,
  getMe,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { googleAuthSuccess, googleAuthError } from "../middlewares/passport.middleware.js";

const router = Router();

router.post("/register",    register);
router.post("/login",       login);
router.post("/admin-login", adminLogin);
router.post("/logout",      logout);
router.get( "/refresh",     refreshToken);
router.get( "/me",          authMiddleware, getMe);

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.get("/google", (req, res, next) => {
    const app = req.query.app || "frontend";
    res.cookie("oauth_app", app, { maxAge: 5 * 60 * 1000, httpOnly: true, sameSite: "lax" });
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: "select_account",
    })(req, res, next);
});

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/error" }),
    googleAuthSuccess
);

router.get("/google/error", (req, res, next) => {
    const err = new Error("Google authentication failed. Please try again.");
    googleAuthError(err, req, res, next);
});

export default router;
