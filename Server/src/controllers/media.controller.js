// src/controllers/media.controller.js

import { getDb } from '../libs/mongoClient.js';
import { MEDIA_COLLECTION } from '../models/media.model.js';
import { getMinioClient } from '../libs/minioClient.js';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import config from '../config/index.js';
import path from 'path';
import { IncomingForm } from 'formidable';
import fs from 'fs/promises';

/**
 * Upload a file using formidable (no multer needed)
 * Formidable parses multipart/form-data, then we upload to MinIO
 */
export const uploadFile = async (req, res) => {
    try {
        const userId = req.userId;

        // Parse multipart/form-data using formidable
        const form = new IncomingForm({
            maxFileSize: 50 * 1024 * 1024, // 50MB limit
            keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({ message: 'File upload error: ' + err.message });
            }

            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            
            if (!file) {
                return res.status(400).json({ message: 'No file provided' });
            }

            try {
                const minioClient = getMinioClient();
                const bucketName = config.MINIO_BUCKET_NAME;

                // Read file from filesystem (formidable saves to temp location)
                const fileBuffer = await fs.readFile(file.filepath);
                
                // Generate unique object key
                const fileExtension = path.extname(file.originalFilename || '');
                const uniqueId = crypto.randomBytes(16).toString('hex');
                const objectKey = `${userId}/${uniqueId}${fileExtension}`;

                // Upload to MinIO
                await minioClient.putObject(
                    bucketName,
                    objectKey,
                    fileBuffer,
                    file.size,
                    {
                        'Content-Type': file.mimetype || 'application/octet-stream',
                    }
                );

                // Clean up temp file
                await fs.unlink(file.filepath).catch(() => {});

                // Save metadata to database first
                const db = getDb();
                const mediaDoc = {
                    objectKey,
                    uploadedBy: userId,
                    originalName: file.originalFilename || 'unknown',
                    mimeType: file.mimetype || 'application/octet-stream',
                    size: file.size,
                    url: '', // Will be updated after insert
                    uploadedAt: new Date(),
                };

                const result = await db.collection(MEDIA_COLLECTION)
                    .insertOne(mediaDoc);

                // Generate URL - use backend API endpoint to serve files
                // This ensures files are accessible through the backend with proper auth/CORS
                const finalFileUrl = `/media/file/${result.insertedId.toString()}`;
                
                // Update the document with the correct URL
                await db.collection(MEDIA_COLLECTION).updateOne(
                    { _id: result.insertedId },
                    { $set: { url: finalFileUrl } }
                );

                res.status(201).json({
                    id: result.insertedId.toString(),
                    url: finalFileUrl,
                    objectKey,
                    originalName: file.originalFilename,
                    mimeType: file.mimetype,
                    size: file.size,
                });
            } catch (error) {
                console.error('Error uploading file:', error);
                // Clean up temp file on error
                await fs.unlink(file.filepath).catch(() => {});
                res.status(500).json({ message: 'Failed to upload file' });
            }
        });
    } catch (error) {
        console.error('Error in upload handler:', error);
        res.status(500).json({ message: 'Failed to upload file' });
    }
};

/**
 * Get file metadata
 */
export const getFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const db = getDb();

        const file = await db.collection(MEDIA_COLLECTION)
            .findOne({ _id: new ObjectId(fileId) });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.json({
            id: file._id.toString(),
            url: file.url || `/media/file/${fileId}`,
            originalName: file.originalName,
            mimeType: file.mimeType,
            size: file.size,
            uploadedAt: file.uploadedAt.toISOString(),
        });
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ message: 'Failed to fetch file' });
    }
};

/**
 * Serve/download a file from MinIO
 */
export const serveFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const db = getDb();

        // Get file metadata
        const file = await db.collection(MEDIA_COLLECTION)
            .findOne({ _id: new ObjectId(fileId) });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Get file from MinIO
        const minioClient = getMinioClient();
        const bucketName = config.MINIO_BUCKET_NAME;

        // Stream file from MinIO
        const dataStream = await minioClient.getObject(bucketName, file.objectKey);

        // Set appropriate headers
        res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
        res.setHeader('Content-Length', file.size);
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

        // Pipe the file stream to response
        dataStream.pipe(res);

        dataStream.on('error', (err) => {
            console.error('Error streaming file:', err);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming file' });
            }
        });
    } catch (error) {
        console.error('Error serving file:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to serve file' });
        }
    }
};

/**
 * Delete a file
 */
export const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const userId = req.userId;
        const db = getDb();

        const file = await db.collection(MEDIA_COLLECTION)
            .findOne({ _id: new ObjectId(fileId) });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Only allow deletion by uploader
        if (file.uploadedBy !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Delete from MinIO
        const minioClient = getMinioClient();
        await minioClient.removeObject(config.MINIO_BUCKET_NAME, file.objectKey);

        // Delete from database
        await db.collection(MEDIA_COLLECTION)
            .deleteOne({ _id: new ObjectId(fileId) });

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Failed to delete file' });
    }
};
