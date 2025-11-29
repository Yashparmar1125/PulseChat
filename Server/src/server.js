// src/server.js (Cleaned-up version)

import dotenv from 'dotenv';
dotenv.config();
import morgan from "morgan";
import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';

// --- Imports for Initialization and Logic ---
import { connectMongo, closeMongo } from './libs/mongoClient.js';
import { initFirebaseAdmin } from './libs/firebaseAdmin.js';
import { initMinioClient } from './libs/minioClient.js';
import firebaseAuth from './middlewares/firebaseAuth.middleware.js';
import socketAuth from './sockets/socketAuth.js';
import { registerSocketHandlers } from './sockets/socketHandler.js'; // NEW Import

//models
import { initUserModel } from './models/user.model.js'; 
import { initMediaModel } from './models/media.model.js'; 
import { initConversationModel } from './models/conversation.model.js'; 
import { initMessageModel } from './models/message.model.js'; 
import { initStatusModel } from './models/status.model.js';      // NEW
import { initCommunityModel } from './models/community.model.js'; // NEW
import { initCallLogModel } from './models/callLog.model.js';     // NEW


//Routes
import healthRoutes from './routes/health.routes.js';      // Detailed Health Check
import authRoutes from './routes/auth.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import mediaRoutes from './routes/media.routes.js';
import statusRoutes from './routes/status.routes.js';
import communityRoutes from './routes/community.routes.js';
import callRoutes from './routes/call.routes.js';

const PORT = process.env.PORT || 4000;

// ------------------------------------------
// 1. EXPRESS & HTTP SERVER SETUP
// ------------------------------------------
const app = express();

// CORS middleware for Express routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from common development origins
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());
app.use(morgan('dev'));

// Prevent caching for all API endpoints (important for real-time data)
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});

// Health & protected route example (Express Routes)
app.use('/health', healthRoutes); 
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/status', statusRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/calls', callRoutes);

let io; // socket server reference

async function start() {
  
  // ------------------------------------------
  // 2. INITIALIZE DEPENDENCIES (Firebase, Mongo & MinIO)
  // ------------------------------------------
  initFirebaseAdmin();
  await connectMongo();
  initMinioClient();

  // Initialize Models
  await initUserModel();
  await initMediaModel();
  await initConversationModel();
  await initMessageModel();
  await initStatusModel();
  await initCommunityModel();
  await initCallLogModel();
  // ------------------------------------------
  // 3. CREATE SERVERS
  // ------------------------------------------
  const server = http.createServer(app);
  io = new IOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  // ------------------------------------------
  // 4. SOCKET.IO SETUP
  // ------------------------------------------
  io.use(socketAuth); // Socket authentication middleware
  registerSocketHandlers(io); // Register all event listeners (CLEANER!)
  
  // Set Socket.IO instance in controllers for REST API broadcasts
  const { setSocketIOInstance: setMessageSocketIO } = await import('./controllers/message.controller.js');
  setMessageSocketIO(io);
  
  const { setSocketIOInstance: setConversationSocketIO } = await import('./controllers/conversation.controller.js');
  setConversationSocketIO(io);

  // ------------------------------------------
  // 5. START SERVER
  // ------------------------------------------
  server.listen(PORT, "0.0.0.0",() => {
    console.log(`\n✅ Server listening on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api/v1`);
    console.log(`🔌 WebSocket available at ws://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
  });

  // ------------------------------------------
  // 6. GRACEFUL SHUTDOWN
  // ------------------------------------------
  const shutdown = async () => {
    console.log('Shutting down...');
    try {
      io.close();
      await closeMongo();
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    } catch (err) {
      console.error('Error during shutdown', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('Startup error', err);
  process.exit(1);
});