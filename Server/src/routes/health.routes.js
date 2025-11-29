// src/routes/health.routes.js

import express from 'express';
import { detailedHealthCheck } from '../controllers/health.controller.js';

const router = express.Router();

/**
 * GET /health
 * Detailed status check of all core server components.
 */
router.get('/', detailedHealthCheck);

export default router;