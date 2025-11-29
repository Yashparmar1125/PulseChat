// src/utils/encryption.utils.js
// Encryption utilities for sensitive data stored in MongoDB

import crypto from 'crypto';
import config from '../config/index.js';

// Get encryption key from config (must be 32 bytes for AES-256)
const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY || config.ENCRYPTION_KEY;
    
    if (!key) {
        console.warn('ENCRYPTION_KEY not set. Using default key (NOT SECURE FOR PRODUCTION).');
        // Generate a default key for development (32 bytes)
        return crypto.scryptSync('default-key-change-in-production', 'salt', 32);
    }
    
    // If key is a string, derive a 32-byte key from it
    if (typeof key === 'string') {
        return crypto.scryptSync(key, 'pulsechat-salt', 32);
    }
    
    return key;
};

const ENCRYPTION_KEY = getEncryptionKey();
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 16 bytes for AES
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM authentication tag

/**
 * Encrypt sensitive data before storing in MongoDB
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted text (base64 encoded)
 */
export function encrypt(text) {
    if (!text || text === null) {
        return null;
    }
    
    try {
        // Generate a random IV for each encryption
        const iv = crypto.randomBytes(IV_LENGTH);
        
        // Create cipher
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        
        // Encrypt the text
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        
        // Get authentication tag
        const authTag = cipher.getAuthTag();
        
        // Combine IV + authTag + encrypted data
        const combined = Buffer.concat([
            iv,
            authTag,
            Buffer.from(encrypted, 'base64')
        ]);
        
        // Return as base64 string
        return combined.toString('base64');
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt sensitive data retrieved from MongoDB
 * @param {string} encryptedText - Encrypted text (base64 encoded)
 * @returns {string|null} - Decrypted plain text or null if input is null/empty
 */
export function decrypt(encryptedText) {
    if (!encryptedText || encryptedText === null) {
        return null;
    }
    
    try {
        // Convert base64 string to buffer
        const combined = Buffer.from(encryptedText, 'base64');
        
        // Extract IV, authTag, and encrypted data
        const iv = combined.slice(0, IV_LENGTH);
        const authTag = combined.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        const encrypted = combined.slice(IV_LENGTH + AUTH_TAG_LENGTH);
        
        // Create decipher
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        decipher.setAuthTag(authTag);
        
        // Decrypt
        let decrypted = decipher.update(encrypted, null, 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        // If decryption fails, it might be old unencrypted data
        // Return null to indicate decryption failure
        throw new Error('Failed to decrypt data. Data may be corrupted or encrypted with different key.');
    }
}

/**
 * Encrypt an array of strings (e.g., FCM tokens)
 * @param {string[]} array - Array of strings to encrypt
 * @returns {string[]} - Array of encrypted strings
 */
export function encryptArray(array) {
    if (!array || !Array.isArray(array)) {
        return [];
    }
    return array.map(item => encrypt(item));
}

/**
 * Decrypt an array of strings
 * @param {string[]} encryptedArray - Array of encrypted strings
 * @returns {string[]} - Array of decrypted strings
 */
export function decryptArray(encryptedArray) {
    if (!encryptedArray || !Array.isArray(encryptedArray)) {
        return [];
    }
    return encryptedArray
        .map(item => {
            try {
                return decrypt(item);
            } catch (error) {
                console.warn('Failed to decrypt array item:', error.message);
                return null;
            }
        })
        .filter(item => item !== null);
}



