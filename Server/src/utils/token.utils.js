// src/utils/token.utils.js

import jwt from 'jsonwebtoken';
// IMPORTANT: Ensure you have run 'pnpm install jsonwebtoken'
import config from '../config/index.js'; 

export function generateAccessToken(userId) {
    return jwt.sign(
        { userId }, 
        config.JWT_SECRET, 
        { expiresIn: config.ACCESS_TOKEN_LIFETIME } // e.g., '15m'
    );
}

export function generateRefreshToken(userId) {
    // The refresh token should be signed with a different secret
    return jwt.sign(
        { userId, type: 'refresh' }, 
        config.REFRESH_TOKEN_SECRET, 
        { expiresIn: config.REFRESH_TOKEN_LIFETIME } // e.g., '7d'
    );
}

export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        return { error: error.name, message: error.message }; // TokenExpiredError, JsonWebTokenError
    }
}

export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return { error: error.name, message: error.message };
    }
}