import rateLimit from 'express-rate-limit';
import { Request } from 'express';

/**
 * 1. AUTH LIMITER (For unauthenticated users)
 * Protects /auth/login and /auth/register endpoints against brute-force attacks.
 * Blocks traffic based on the IP address.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit: 20 attempts per IP within the window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { 
        status: 429, 
        error: "Too many login/register attempts from this IP, please try again after 15 minutes." 
    }
});

/**
 * 2. API USER LIMITER (For authenticated users)
 * Protects general API resources.
 * The throttling key is the User ID (req.user._id) to avoid blocking shared IPs (e.g., office WiFi).
 */
export const apiUserLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // Limit: 50 requests per user per minute
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
        if(req.path === '/api/auth/login' || req.path === '/api/auth/register'){
            return true; 
        }
        return false;
    },
    
    // Custom key generator to throttle specific users instead of IPs
    keyGenerator: (req: Request) => {
        // Casting to 'any' or your custom UserRequest interface is often needed here
        const user = (req as any).user;

        // IF LOGGED IN: Use User ID as the unique key
        if (user && user._id) {
            return user._id.toString();
        }

        // FALLBACK: Use IP if no user is found (safety net)
        return req.ip || 'unknown-ip';
    },
    message: { 
        status: 429, 
        error: "You have exceeded the API request limit. Please try again after 1 minute." 
    }
});