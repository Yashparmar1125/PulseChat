# Data Encryption Guide

This document explains how sensitive data is encrypted before being stored in MongoDB.

## Overview

Sensitive data such as `refreshToken` and `fcmTokens` are encrypted using **AES-256-GCM** (Galois/Counter Mode) before being stored in the database. This provides both confidentiality and authentication.

## Configuration

### Environment Variable

Add the following to your `.env` file:

```env
ENCRYPTION_KEY=your-32-byte-or-longer-secret-key-here
```

**Important Security Notes:**
- The encryption key should be at least 32 characters long (32 bytes for AES-256)
- Use a strong, random key in production
- Never commit the encryption key to version control
- Store the key securely (e.g., in environment variables, secrets manager)

### Generating a Secure Key

You can generate a secure random key using Node.js:

```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

Or using OpenSSL:

```bash
openssl rand -hex 32
```

## Encrypted Fields

The following fields are automatically encrypted before storage:

1. **`refreshToken`** - JWT refresh tokens stored in the user document
2. **`fcmTokens`** - Firebase Cloud Messaging tokens (array of encrypted strings)

## Migration

If you have existing unencrypted data in your database, run the migration script:

```bash
npm run migrate-encryption
```

This script will:
- Detect unencrypted `refreshToken` values and encrypt them
- Detect unencrypted `fcmTokens` arrays and encrypt each token
- Skip data that is already encrypted
- Log the migration results

**Note:** Make sure `ENCRYPTION_KEY` is set in your `.env` file before running the migration.

## Implementation Details

### Encryption Algorithm
- **Algorithm:** AES-256-GCM
- **IV Length:** 16 bytes (randomly generated per encryption)
- **Auth Tag Length:** 16 bytes (for authentication)

### Storage Format
Encrypted data is stored as base64-encoded strings containing:
- IV (Initialization Vector)
- Authentication Tag
- Encrypted Data

### Security Features
- Each encryption uses a unique IV (prevents pattern analysis)
- Authentication tag ensures data integrity
- Decryption automatically fails if data is tampered with
- Old unencrypted data can be automatically migrated

## API Behavior

- Encrypted fields are **never** returned in API responses
- The `refreshToken` is removed from user objects before sending to clients
- Only the plain-text refresh token is sent to clients during login/registration
- FCM tokens are encrypted in the database but can be decrypted when needed for push notifications

## Troubleshooting

### "Failed to decrypt data" Error

This can occur if:
1. The `ENCRYPTION_KEY` has changed since data was encrypted
2. The data was corrupted
3. The data is in an old unencrypted format (run migration)

### Migration Issues

If migration fails:
1. Verify `ENCRYPTION_KEY` is set correctly
2. Check MongoDB connection
3. Review error logs for specific user/document issues
4. Ensure you have write permissions to the database

## Best Practices

1. **Backup your database** before running migrations
2. **Test encryption/decryption** in a development environment first
3. **Rotate encryption keys** periodically (requires re-encryption of all data)
4. **Monitor logs** for decryption errors (may indicate key mismatch)
5. **Never log** encrypted or decrypted tokens in production



