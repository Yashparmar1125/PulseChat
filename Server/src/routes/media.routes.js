// src/routes/media.routes.js

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    uploadFile,
    getFile,
    deleteFile,
} from '../controllers/media.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Upload file (no multer - using formidable directly)
router.post('/upload', uploadFile);

// Get file metadata
router.get('/:fileId', getFile);

// Delete file
router.delete('/:fileId', deleteFile);

export default router;

