// src/validators/auth.validator.js

/**
 * Middleware to validate required fields for registration.
 * Expected body: { idToken: string, username?: string, fcmToken?: string }
 * Note: username is optional for social auth, will be extracted from Firebase token if not provided
 */
export const validateRegistration = (req, res, next) => {
    const { idToken } = req.body;
    
    if (!idToken) {
        return res.status(400).json({ message: 'Missing Firebase ID Token.' });
    }
    // Username is optional - can be extracted from Firebase token if not provided
    // Add logic for minimum username length if provided, etc.
    
    next();
};

/**
 * Middleware to validate required fields for login/social auth.
 * Expected body: { idToken: string, fcmToken?: string }
 */
export const validateLogin = (req, res, next) => {
    const { idToken } = req.body;
    
    if (!idToken) {
        return res.status(400).json({ message: 'Missing Firebase ID Token for login.' });
    }

    next();
};

/**
 * Middleware to validate the refresh token request.
 * Expected body: { refreshToken: string }
 */
export const validateTokenRefresh = (req, res, next) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh Token is required for token renewal.' });
    }

    next();
};