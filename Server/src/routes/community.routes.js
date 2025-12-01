// src/routes/community.routes.js

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    getCommunities,
    getCommunity,
    createCommunity,
    joinCommunity,
    leaveCommunity,
} from '../controllers/community.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all communities
router.get('/', getCommunities);

// Get a single community
router.get('/:communityId', getCommunity);

// Create community
router.post('/', createCommunity);

// Join community
router.post('/:communityId/join', joinCommunity);

// Leave community
router.post('/:communityId/leave', leaveCommunity);

export default router;






