// src/routes/call.routes.js

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    getCallLogs,
    initiateCall,
    updateCall,
} from '../controllers/call.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get call logs
router.get('/', getCallLogs);

// Initiate call
router.post('/', initiateCall);

// Update call status
router.patch('/:callId', updateCall);

export default router;







