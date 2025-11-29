// src/libs/minioClient.js

import * as Minio from 'minio';
import config from '../config/index.js';

let minioClient;

/**
 * Initializes the MinIO Client and ensures the required bucket exists.
 */
export function initMinioClient() {
    if (minioClient) return minioClient;
    
    // 1. Initialize MinIO Client
    minioClient = new Minio.Client({
        endPoint: config.MINIO_ENDPOINT,
        port: config.MINIO_PORT,
        useSSL: config.MINIO_SECURE,
        accessKey: config.MINIO_ACCESS_KEY,
        secretKey: config.MINIO_SECRET_KEY,
    });
    
    // 2. Check and Create Bucket
    minioClient.bucketExists(config.MINIO_BUCKET_NAME, (err, exists) => {
        if (err) {
            console.error('MinIO bucket check error:', err);
            // This error will crash the application because file uploads are critical
            throw new Error('MinIO connection failed.'); 
        }
        
        if (!exists) {
            console.log(`MinIO bucket "${config.MINIO_BUCKET_NAME}" does not exist. Creating...`);
            minioClient.makeBucket(config.MINIO_BUCKET_NAME, 'us-east-1', (err) => {
                if (err) {
                    console.error('MinIO bucket creation failed:', err);
                    throw new Error('MinIO bucket creation failed.');
                }
                console.log(`MinIO bucket "${config.MINIO_BUCKET_NAME}" created successfully.`);
            });
        } else {
            console.log(`MinIO bucket "${config.MINIO_BUCKET_NAME}" is ready.`);
        }
    });

    return minioClient;
}

/**
 * Returns the initialized MinIO client instance.
 */
export function getMinioClient() {
    if (!minioClient) {
        throw new Error('MinIO Client not initialized. Call initMinioClient() first.');
    }
    return minioClient;
}