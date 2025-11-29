// src/routes/message.routes.js

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    getMessages,
    sendMessage,
    updateMessage,
    deleteMessage,
    markAsRead,
} from '../controllers/message.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get messages for a conversation
router.get('/conversation/:conversationId', getMessages);

// Send a message
router.post('/conversation/:conversationId', sendMessage);

// Mark messages as read
router.post('/conversation/:conversationId/read', markAsRead);

// Update a message
router.patch('/:messageId', updateMessage);

// Delete a message
router.delete('/:messageId', deleteMessage);

export default router;



