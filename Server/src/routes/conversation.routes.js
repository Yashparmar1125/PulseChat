// src/routes/conversation.routes.js

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    getConversations,
    getConversation,
    createConversation,
    archiveConversation,
    pinConversation,
    deleteConversation,
} from '../controllers/conversation.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all conversations for current user
router.get('/', getConversations);

// Get a single conversation
router.get('/:conversationId', getConversation);

// Create a new conversation
router.post('/', createConversation);

// Archive/Unarchive conversation
router.patch('/:conversationId/archive', archiveConversation);

// Pin/Unpin conversation
router.patch('/:conversationId/pin', pinConversation);

// Delete conversation
router.delete('/:conversationId', deleteConversation);

export default router;






