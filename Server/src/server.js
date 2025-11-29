// src/server.js (Cleaned-up version)

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';

// --- Imports for Initialization and Logic ---
import { connectMongo, closeMongo } from './libs/mongoClient.js';
import { initFirebaseAdmin } from './libs/firebaseAdmin.js';
import firebaseAuth from './middlewares/firebaseAuth.middleware.js';
import socketAuth from './sockets/socketAuth.js';
import { registerSocketHandlers } from './sockets/socketHandler.js'; // NEW Import

const PORT = process.env.PORT || 4000;

// ------------------------------------------
// 1. EXPRESS & HTTP SERVER SETUP
// ------------------------------------------
const app = express();
app.use(express.json());

// Health & protected route example (Express Routes)
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/v1/me', firebaseAuth, (req, res) => res.json({ user: req.user }));

let io; // socket server reference

async function start() {
  
  // ------------------------------------------
  // 2. INITIALIZE DEPENDENCIES (Firebase & Mongo)
  // ------------------------------------------
  initFirebaseAdmin();
  await connectMongo();

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

  // ------------------------------------------
  // 5. START SERVER
  // ------------------------------------------
  server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

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