// src/config/index.js
import dotenv from 'dotenv';
dotenv.config()
// so we can directly access process.env here.

const config = {
    // --- Server Configuration ---
    PORT: process.env.PORT || 4000,
    
    // --- Database Configuration (MongoDB) ---
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.MONGO_DB || "PulseChat",
  
    // --- Firebase Configuration ---
    // Path to your Firebase Service Account JSON file
    FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    
    // --- JWT Configuration ---
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-token-key-change-in-production',
    ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME || '15m',
    REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME || '7d',
    
    // --- Encryption Configuration ---
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'your-32-byte-encryption-key-change-in-production-must-be-secure',
    
    // --- Object Storage (MinIO) Configuration ---
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_PORT: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_SECURE: process.env.MINIO_SECURE === 'true', // true or false
    MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME || "pulsechat-files",
  };
  
  // Simple check for critical variables at startup
  const requiredConfig = [
    'MONGO_URI',
    'FIREBASE_SERVICE_ACCOUNT_PATH',
    'MINIO_ACCESS_KEY',
  ];
  
  for (const key of requiredConfig) {
    if (!config[key]) {
      console.error(`FATAL ERROR: Environment variable ${key} is not set.`);
      process.exit(1);
    }
  }
  
  export default config;