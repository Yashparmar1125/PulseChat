// src/routes/media.routes.js

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    uploadFile,
    getFile,
    deleteFile,
    serveFile,
} from '../controllers/media.controller.js';

const router = express.Router();

// Upload file (no multer - using formidable directly) - requires auth
router.post('/upload', authMiddleware, uploadFile);

// Serve file - public access (files are already protected by unique IDs)
// This route should be before the /:fileId route to avoid conflicts
router.get('/file/:fileId', serveFile);

// Get file metadata - requires auth
router.get('/:fileId', authMiddleware, getFile);

// Delete file - requires auth
router.delete('/:fileId', authMiddleware, deleteFile);

export default router;

