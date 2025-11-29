// src/routes/auth.routes.js

import express from 'express';

// validators imports
import { validateRegistration, validateLogin, validateTokenRefresh } from '../validators/auth.validator.js';

// middleware imports
import authMiddleware from '../middlewares/auth.middleware.js';

// controllers imports
import {
  register,
  login,
  socialAuth,
  refreshToken,
  logout,
  currentUser,
  completeTutorial,
} from '../controllers/auth.controller.js';

const router = express.Router();

// --- Public Routes (No Access Token Required) ---

// Traditional and Social Signup
router.post('/register', validateRegistration, register);

// Traditional and Social Login
router.post('/login', validateLogin, login);
router.post('/social/:provider', validateLogin, socialAuth); 

// Renew Access Token
router.post('/refresh-token', validateTokenRefresh, refreshToken);


// --- Protected Routes (Access Token Required via authMiddleware) ---

// Get current user data
router.get('/user', authMiddleware, currentUser);

// Logout (Requires Access Token to identify user to revoke refresh token)
router.post('/logout', authMiddleware, logout); 

// User tutorial tracking
router.post('/tutorial/complete', authMiddleware, completeTutorial);

export default router;