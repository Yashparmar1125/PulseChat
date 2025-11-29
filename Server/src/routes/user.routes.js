// src/routes/user.routes.js

import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    searchUsers,
    getUserProfile,
    updateProfile,
} from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Search users
router.get('/search', searchUsers);

// Get user profile
router.get('/:userId', getUserProfile);

// Update own profile
router.patch('/profile', updateProfile);

export default router;



