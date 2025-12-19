import {rateLimit,ipKeyGenerator }from 'express-rate-limit';
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
    validate: {
        ip: false,
        trustProxy: false 
    },
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
    max: 10, // Limit: 50 requests per user per minute
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
        ip: false,
        trustProxy: false 
    },
    skip: (req: Request) => {
        if (req.method === 'OPTIONS') return true;

        const url = req.originalUrl || req.url;

        if (url.includes('/login') || url.includes('/register')) {
            return true; 
        }
        return false;
    },
    
    // Custom key generator to throttle specific users instead of IPs
    keyGenerator: (req: Request) => {
        // Casting to 'any' or your custom UserRequest interface is often needed here
        const user = req.user;

        // IF LOGGED IN: Use User ID as the unique key
        if (user && user._id) {
            return user._id.toString();
        }

        // FALLBACK: Use IP if no user is found (safety net)
        return ipKeyGenerator(req.ip!);
    },
    message: { 
        status: 429, 
        error: "You have exceeded the API request limit. Please try again after 1 minute." 
    }
});