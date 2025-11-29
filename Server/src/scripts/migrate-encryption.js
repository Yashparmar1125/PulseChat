// src/scripts/migrate-encryption.js
// Script to migrate existing unencrypted data to encrypted format
// Run this once after deploying encryption: node src/scripts/migrate-encryption.js

import dotenv from 'dotenv';
dotenv.config();

import { connectMongo, closeMongo } from '../libs/mongoClient.js';
import { migrateRefreshTokensToEncrypted, migrateFcmTokensToEncrypted } from '../utils/migration.utils.js';

async function runMigration() {
    console.log('Starting encryption migration...');
    console.log('Make sure ENCRYPTION_KEY is set in your .env file!\n');
    
    try {
        // Connect to MongoDB
        await connectMongo();
        console.log('Connected to MongoDB\n');
        
        // Migrate refresh tokens
        console.log('Migrating refresh tokens...');
        const refreshTokenResults = await migrateRefreshTokensToEncrypted();
        console.log(`Refresh tokens: ${refreshTokenResults.migrated} migrated, ${refreshTokenResults.skipped} skipped, ${refreshTokenResults.errors} errors\n`);
        
        // Migrate FCM tokens
        console.log('Migrating FCM tokens...');
        const fcmTokenResults = await migrateFcmTokensToEncrypted();
        console.log(`FCM tokens: ${fcmTokenResults.migrated} migrated, ${fcmTokenResults.skipped} skipped, ${fcmTokenResults.errors} errors\n`);
        
        console.log('Migration complete!');
        
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await closeMongo();
        process.exit(0);
    }
}

runMigration();



