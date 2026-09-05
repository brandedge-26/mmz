import { ZodError } from "zod";

const ALLOWED_ORIGINS = [
    "https://memonmobilezone122.pk",
    "https://www.memonmobilezone122.pk",
    "https://shop.memonmobilezone122.pk",
    "https://www.shop.memonmobilezone122.pk",
    "https://admin.memonmobilezone122.pk",
    "https://www.admin.memonmobilezone122.pk",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
];

export const globalErrorHandler = (err, req, res, next) => {

    // Always set CORS headers so errors don't show as CORS issues in browser
    const origin = req.headers.origin;
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin || "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    if (err instanceof ZodError) {
        const issues = err.issues || [];
        const details = issues.map((issue) => {
            const path = issue.path && issue.path.length ? issue.path.join(".") : "field";
            return `${path}: ${issue.message}`;
        });

        return res.status(400).json({
            success: false,
            message: details.length ? details.join("; ") : "Validation error",
            errors: details,
        });
    }

    const statusCode = err?.cause?.statusCode || err.statusCode || 500;
    const errMessage = err.message || "Server error";

    return res.status(statusCode).json({
        success: false,
        message: errMessage,
    });

};