// src/utils/migration.utils.js
// Utility to migrate existing unencrypted data to encrypted format

import { getDb } from '../libs/mongoClient.js';
import { USER_COLLECTION } from '../models/user.model.js';
import { encrypt } from './encryption.utils.js';
import { decrypt } from './encryption.utils.js';

/**
 * Migrate existing unencrypted refreshTokens to encrypted format
 * Run this once after deploying encryption
 */
export async function migrateRefreshTokensToEncrypted() {
    const db = getDb();
    const usersCollection = db.collection(USER_COLLECTION);
    
    try {
        // Find all users with refreshToken that might be unencrypted
        const users = await usersCollection.find({ 
            refreshToken: { $exists: true, $ne: null } 
        }).toArray();
        
        let migrated = 0;
        let skipped = 0;
        let errors = 0;
        
        for (const user of users) {
            try {
                const refreshToken = user.refreshToken;
                
                // Try to decrypt - if it fails, it's probably unencrypted
                let isEncrypted = false;
                try {
                    decrypt(refreshToken);
                    isEncrypted = true;
                } catch {
                    // Decryption failed - likely unencrypted
                    isEncrypted = false;
                }
                
                if (!isEncrypted) {
                    // Encrypt the unencrypted token
                    const encryptedToken = encrypt(refreshToken);
                    
                    await usersCollection.updateOne(
                        { _id: user._id },
                        { $set: { refreshToken: encryptedToken } }
                    );
                    
                    migrated++;
                    console.log(`Migrated refreshToken for user ${user._id}`);
                } else {
                    skipped++;
                }
            } catch (error) {
                console.error(`Error migrating user ${user._id}:`, error);
                errors++;
            }
        }
        
        console.log(`Migration complete: ${migrated} migrated, ${skipped} already encrypted, ${errors} errors`);
        return { migrated, skipped, errors };
    } catch (error) {
        console.error('Migration error:', error);
        throw error;
    }
}

/**
 * Migrate existing unencrypted FCM tokens to encrypted format
 */
export async function migrateFcmTokensToEncrypted() {
    const db = getDb();
    const usersCollection = db.collection(USER_COLLECTION);
    
    try {
        const users = await usersCollection.find({ 
            fcmTokens: { $exists: true, $ne: [] } 
        }).toArray();
        
        let migrated = 0;
        let skipped = 0;
        let errors = 0;
        
        for (const user of users) {
            try {
                if (!user.fcmTokens || user.fcmTokens.length === 0) {
                    continue;
                }
                
                // Check if tokens are already encrypted (try to decrypt first one)
                let needsMigration = false;
                try {
                    const firstToken = user.fcmTokens[0];
                    decrypt(firstToken);
                    // If decrypt succeeds, it's already encrypted
                    needsMigration = false;
                } catch {
                    // Decrypt failed - likely unencrypted
                    needsMigration = true;
                }
                
                if (needsMigration) {
                    // Encrypt all FCM tokens
                    const encryptedTokens = user.fcmTokens.map(token => encrypt(token));
                    
                    await usersCollection.updateOne(
                        { _id: user._id },
                        { $set: { fcmTokens: encryptedTokens } }
                    );
                    
                    migrated++;
                    console.log(`Migrated FCM tokens for user ${user._id}`);
                } else {
                    skipped++;
                }
            } catch (error) {
                console.error(`Error migrating FCM tokens for user ${user._id}:`, error);
                errors++;
            }
        }
        
        console.log(`FCM tokens migration complete: ${migrated} migrated, ${skipped} already encrypted, ${errors} errors`);
        return { migrated, skipped, errors };
    } catch (error) {
        console.error('FCM tokens migration error:', error);
        throw error;
    }
}



