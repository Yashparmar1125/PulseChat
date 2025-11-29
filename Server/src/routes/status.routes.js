// src/routes/status.routes.js

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    getStatuses,
    createStatus,
    viewStatus,
    deleteStatus,
} from '../controllers/status.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all statuses
router.get('/', getStatuses);

// Create status
router.post('/', createStatus);

// View status
router.post('/:statusId/view', viewStatus);

// Delete status
router.delete('/:statusId', deleteStatus);

export default router;



