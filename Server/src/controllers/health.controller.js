// src/controllers/health.controller.js

import { getDb } from '../libs/mongoClient.js';
import { getFirebaseAuth } from '../libs/firebaseAdmin.js';
import { getMinioClient } from '../libs/minioClient.js';
import config from '../config/index.js';

// --- Dependency Check Helpers ---

async function checkMongoHealth() {
    try {
        const db = getDb();
        // Execute a simple database command to ensure connectivity is live
        const pingResult = await db.command({ ping: 1 });

        return {
            status: 'UP',
            details: {
                message: 'MongoDB connection successful.',
                database: config.MONGO_DB_NAME,
                ping: pingResult.ok,
            }
        };
    } catch (error) {
        return {
            status: 'DOWN',
            details: {
                message: 'MongoDB connection failed.',
                error: error.message,
            }
        };
    }
}

function checkFirebaseHealth() {
    try {
        const auth = getFirebaseAuth();
        // Since Firebase Admin SDK is initialized on startup, we check if the instance exists.
        // For a full check, we'd attempt a lightweight operation (e.g., fetching a user), 
        // but simple initialization check is sufficient for most health monitoring.
        if (auth) {
            return {
                status: 'UP',
                details: {
                    message: 'Firebase Admin SDK initialized.',
                }
            };
        }
    } catch (error) {
        return {
            status: 'DOWN',
            details: {
                message: 'Firebase Admin SDK initialization failed.',
                error: error.message,
            }
        };
    }
}

async function checkMinioHealth() {
    try {
        const minioClient = getMinioClient();
        const bucketName = config.MINIO_BUCKET_NAME;

        // Check if the configured bucket exists (implicit connection check)
        const exists = await minioClient.bucketExists(bucketName);

        if (exists) {
            return {
                status: 'UP',
                details: {
                    message: 'MinIO connection successful and bucket exists.',
                    bucket: bucketName,
                }
            };
        } else {
             return {
                status: 'DOWN',
                details: {
                    message: `MinIO bucket "${bucketName}" not found. Check configuration/setup.`,
                    bucket: bucketName,
                }
            };
        }
    } catch (error) {
        return {
            status: 'DOWN',
            details: {
                message: 'MinIO connection or configuration failed.',
                error: error.message,
            }
        };
    }
}

// --- Main Controller ---

export const detailedHealthCheck = async (req, res) => {
    // Run all dependency checks concurrently
    const [dbStatus, firebaseStatus, minioStatus] = await Promise.all([
        checkMongoHealth(),
        checkFirebaseHealth(),
        checkMinioHealth(),
    ]);

    const healthStatus = {
        server: {
            status: 'UP',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            version: '1.0.0', // Placeholder
        },
        database: dbStatus,
        externalServices: {
            firebase: firebaseStatus,
            minio: minioStatus,
        }
    };

    // Determine overall HTTP status code
    const overallStatus = dbStatus.status === 'DOWN' || 
                          firebaseStatus.status === 'DOWN' ||
                          minioStatus.status === 'DOWN'
                          ? 503 : 200; // 503 Service Unavailable if any critical service is down

    res.status(overallStatus).json(healthStatus);
};